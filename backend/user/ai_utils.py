import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from django.db.models import Avg

class TutorMatcher:
    def __init__(self, tutors_queryset, parent_user=None, search_params=None):
        self.tutors_queryset = tutors_queryset
        self.parent_user = parent_user
        self.search_params = search_params or {}
        
        # Weights
        self.w_subject = 0.35
        self.w_grade = 0.25
        self.w_review = 0.15
        self.w_num = 0.15
        self.w_mode = 0.05
        self.w_loc = 0.15

    def get_parent_request(self):
        # Extract parent profile data - prioritize profile over search params
        grade_level = self.search_params.get('grade_level', "")
        subject = self.search_params.get('subject_name', "")
        location = self.search_params.get('location', "")

        if self.parent_user:
            if hasattr(self.parent_user, 'student_profile') and self.parent_user.student_profile:
                grade_level = self.parent_user.student_profile.grade_level.name if self.parent_user.student_profile.grade_level else grade_level
            
            parent_subjects = [s.name for s in self.parent_user.subject.all()]
            if parent_subjects:
                subject = ", ".join(parent_subjects)
            
            location = self.parent_user.location or location
        
        return {
            "subject": subject,
            "grade_level": grade_level,
            "mode": self.search_params.get('mode', "Online"),
            "location": location
        }

    def prepare_data(self):
        data = []
        for tutor in self.tutors_queryset:
            # Aggregate subjects (now on user model)
            subjects = [s.name for s in tutor.subject.all()]
            subject_str = ", ".join(subjects) if subjects else ""
            
            # Aggregate expertise (as grade level proxy)
            grades = [g.name for g in tutor.tutor_profile.grade.all()]
            grade_str = ", ".join(grades) if grades else ""
            
            # Dynamic rating & review count
            avg_rating = tutor.reviews_received.aggregate(Avg('rating'))['rating__avg']
            rating = float(avg_rating) if avg_rating is not None else 0.0
            reviews_count = tutor.reviews_received.count()
            
            # Collect review comments for text analysis
            all_reviews = " ".join([r.comment for r in tutor.reviews_received.all() if r.comment])
            
            data.append({
                "id": tutor.id,
                "subject": subject_str,
                "grade_level": grade_str,
                "mode": "Online", # Defaulting as per template for now or could be dynamic
                "experience": reviews_count,
                "rating": rating,
                "location": tutor.location or "",
                "review_content": all_reviews
            })
        return pd.DataFrame(data)

    def rank_tutors(self):
        if not self.tutors_queryset.exists():
            return []

        tutors_df = self.prepare_data()
        request = self.get_parent_request()
        print("tutor_df",tutors_df)
        print("request",request)
        # Encoders
        encoder_subject = OneHotEncoder(handle_unknown='ignore')
        encoder_grade = OneHotEncoder(handle_unknown='ignore')
        encoder_mode = OneHotEncoder(handle_unknown='ignore')
        encoder_location = OneHotEncoder(handle_unknown='ignore')

        # Fit & Transform Categorical
        s_combined = pd.concat([tutors_df[["subject"]], pd.DataFrame([[request["subject"]]], columns=["subject"])])
        g_combined = pd.concat([tutors_df[["grade_level"]], pd.DataFrame([[request["grade_level"]]], columns=["grade_level"])])
        m_combined = pd.concat([tutors_df[["mode"]], pd.DataFrame([[request["mode"]]], columns=["mode"])])
        l_combined = pd.concat([tutors_df[["location"]], pd.DataFrame([[request["location"]]], columns=["location"])])

        s_enc = encoder_subject.fit_transform(s_combined).toarray()
        g_enc = encoder_grade.fit_transform(g_combined).toarray()
        m_enc = encoder_mode.fit_transform(m_combined).toarray()
        l_enc = encoder_location.fit_transform(l_combined).toarray()

        t_s = s_enc[:-1]
        t_g = g_enc[:-1]
        t_m = m_enc[:-1]
        t_l = l_enc[:-1]

        p_s = s_enc[-1].reshape(1, -1)
        p_g = g_enc[-1].reshape(1, -1)
        p_m = m_enc[-1].reshape(1, -1)
        p_l = l_enc[-1].reshape(1, -1)

        sim_s = cosine_similarity(p_s, t_s)[0]
        sim_g = cosine_similarity(p_g, t_g)[0]
        sim_m = cosine_similarity(p_m, t_m)[0]
        sim_l = cosine_similarity(p_l, t_l)[0]

        # TF-IDF Review Content Similarity
        # We match the request subject against tutor reviews to see if people mention their success in that area
        review_vectors = []
        if request["subject"] and not tutors_df["review_content"].str.strip().eq("").all():
            tfidf = TfidfVectorizer(stop_words='english')
            # Combine tutor reviews with the request subject as the target document
            all_content = tutors_df["review_content"].tolist() + [request["subject"]]
            tfidf_matrix = tfidf.fit_transform(all_content)
            
            # Similarity of tutors' reviews to the parent's search subject
            review_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
        else:
            review_sim = np.zeros(len(tutors_df))

        # Numerical Features
        scaler = MinMaxScaler()
        num_cols = ["experience", "rating"]
        num_scaled = scaler.fit_transform(tutors_df[num_cols])
        num_sim = num_scaled.sum(axis=1) / 2

        # Weighted Score
        total_score = (
            self.w_subject * sim_s +
            self.w_grade * sim_g +
            self.w_review * review_sim +
            self.w_num * num_sim +
            self.w_mode * sim_m +
            self.w_loc * sim_l
        )

        tutors_df["match_score"] = total_score
        return tutors_df.sort_values(by="match_score", ascending=False)
