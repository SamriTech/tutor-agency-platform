import re
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
        grade_level = self.search_params.get('grade_level', "").lower()
        subject = self.search_params.get('subject_name', "").lower()
        location = self.search_params.get('location', "").lower()

        if self.parent_user:
            if hasattr(self.parent_user, 'student_profile') and self.parent_user.student_profile:
                if self.parent_user.student_profile.grade_level:
                    grade_level = self.parent_user.student_profile.grade_level.name.lower()
            
            parent_subjects = [s.name.lower() for s in self.parent_user.subject.all()]
            if parent_subjects:
                subject = ", ".join(parent_subjects)
            
            if self.parent_user.location:
                location = self.parent_user.location.lower()
        
        return {
            "subject": subject,
            "grade_level": grade_level,
            "mode": self.search_params.get('mode', "Online"),
            "location": location
        }

    def prepare_data(self):
        data = []
        for tutor in self.tutors_queryset:
            # Aggregate subjects (multi-valued)
            subjects = [s.name.lower() for s in tutor.subject.all()]
            
            # Aggregate grades (multi-valued)
            grades = [g.name.lower() for g in tutor.tutor_profile.grade.all()]
            
            # Dynamic rating & review count
            avg_rating = tutor.reviews_received.aggregate(Avg('rating'))['rating__avg']
            rating = float(avg_rating) if avg_rating is not None else 0.0
            reviews_count = tutor.reviews_received.count()
            
            # Collect review comments for text analysis
            all_reviews = " ".join([r.comment.lower() for r in tutor.reviews_received.all() if r.comment])
            
            data.append({
                "id": tutor.id,
                "subjects": set(subjects),
                "grades": set(grades),
                "mode": "Online", # Defaulting as per template
                "experience": float(reviews_count),
                "rating": float(rating),
                "location": (tutor.location or "").lower(),
                "review_content": all_reviews,
                "original_obj": tutor # Keep reference if needed for serializer
            })
        return data

    def calculate_similarity(self, req_val, tutor_vals):
        """Simple overlap similarity for sets/strings."""
        if not req_val or not tutor_vals:
            return 0.0
        
        if isinstance(tutor_vals, set):
            # If any of the requested subjects match tutor subjects
            req_words = set(re.findall(r'\w+', req_val.lower()))
            overlap = req_words.intersection(tutor_vals)
            return 1.0 if overlap else 0.0
        
        return 1.0 if req_val.lower() in tutor_vals.lower() else 0.0

    def calculate_text_sim(self, target_text, source_text):
        """Simple word-based matching for review content."""
        if not target_text or not source_text:
            return 0.0
        target_words = set(re.findall(r'\w+', target_text.lower()))
        source_words = set(re.findall(r'\w+', source_text.lower()))
        if not target_words:
            return 0.0
        overlap = target_words.intersection(source_words)
        return len(overlap) / len(target_words)

    def rank_tutors(self):
        if not self.tutors_queryset.exists():
            return []

        tutors_data = self.prepare_data()
        request = self.get_parent_request()
        
        # Scaling parameters for numerical features
        max_exp = max([d["experience"] for d in tutors_data]) if tutors_data else 1.0
        min_exp = min([d["experience"] for d in tutors_data]) if tutors_data else 0.0
        max_rat = max([d["rating"] for d in tutors_data]) if tutors_data else 1.0
        min_rat = min([d["rating"] for d in tutors_data]) if tutors_data else 0.0

        for tutor in tutors_data:
            # 1. Subject Similarity
            sim_s = self.calculate_similarity(request["subject"], tutor["subjects"])
            
            # 2. Grade Similarity
            sim_g = self.calculate_similarity(request["grade_level"], tutor["grades"])
            
            # 3. Location Similarity
            sim_l = self.calculate_similarity(request["location"], tutor["location"])
            
            # 4. Mode Similarity
            sim_m = 1.0 if request["mode"] == tutor["mode"] else 0.0
            
            # 5. Review Text Similarity (Match search subject against review content)
            review_sim = self.calculate_text_sim(request["subject"], tutor["review_content"])
            
            # 6. Numerical Scoring (Manual MinMax Scaling)
            exp_score = (tutor["experience"] - min_exp) / (max_exp - min_exp) if max_exp > min_exp else 1.0
            rat_score = (tutor["rating"] - min_rat) / (max_rat - min_rat) if max_rat > min_rat else 1.0
            num_sim = (exp_score + rat_score) / 2.0

            # Weighted Score
            tutor["match_score"] = (
                self.w_subject * sim_s +
                self.w_grade * sim_g +
                self.w_review * review_sim +
                self.w_num * num_sim +
                self.w_mode * sim_m +
                self.w_loc * sim_l
            )

        # Sort and return
        tutors_data.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Return as a simple list of dicts with 'id' and 'match_score' to match views.py usage
        results = []
        for d in tutors_data:
            results.append({
                "id": d["id"],
                "match_score": d["match_score"]
            })
        return results
