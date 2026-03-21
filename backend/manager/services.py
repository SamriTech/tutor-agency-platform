import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

def recommend_tutors_django(request_dict, tutors_df, top_n=3):
    """
    Encodes categorical data, calculates cosine similarity, 
    and applies weighted scoring to find the best match.
    """
    # Ensure DataFrame isn't empty
    if tutors_df.empty:
        return pd.DataFrame()

    # ---- Encode categorical features ----
    encoder_subject = OneHotEncoder(handle_unknown='ignore')
    encoder_grade = OneHotEncoder(handle_unknown='ignore')
    encoder_mode = OneHotEncoder(handle_unknown='ignore')
    encoder_location = OneHotEncoder(handle_unknown='ignore')

    # Prepare combined data for fit_transform
    subject_combined = pd.concat([tutors_df[["subject"]], pd.DataFrame([[request_dict["subject"]]], columns=["subject"])])
    grade_combined = pd.concat([tutors_df[["grade_level"]], pd.DataFrame([[request_dict["grade_level"]]], columns=["grade_level"])])
    mode_combined = pd.concat([tutors_df[["mode"]], pd.DataFrame([[request_dict["mode"]]], columns=["mode"])])
    location_combined = pd.concat([tutors_df[["location"]], pd.DataFrame([[request_dict["location"]]], columns=["location"])])

    # Transform to numeric vectors
    subject_encoded = encoder_subject.fit_transform(subject_combined).toarray()
    grade_encoded = encoder_grade.fit_transform(grade_combined).toarray()
    mode_encoded = encoder_mode.fit_transform(mode_combined).toarray()
    location_encoded = encoder_location.fit_transform(location_combined).toarray()

    tutor_subject = subject_encoded[:-1]
    tutor_grade = grade_encoded[:-1]
    tutor_mode = mode_encoded[:-1]
    tutor_location = location_encoded[:-1]

    parent_subject = subject_encoded[-1].reshape(1, -1)
    parent_grade = grade_encoded[-1].reshape(1, -1)
    parent_mode = mode_encoded[-1].reshape(1, -1)
    parent_location = location_encoded[-1].reshape(1, -1)

    # Compute similarities
    sim_subject = cosine_similarity(parent_subject, tutor_subject)[0]
    sim_grade = cosine_similarity(parent_grade, tutor_grade)[0]
    sim_mode = cosine_similarity(parent_mode, tutor_mode)[0]
    sim_location = cosine_similarity(parent_location, tutor_location)[0]

    # ---- Numerical similarity ----
    scaler = MinMaxScaler()
    numerical_scaled = scaler.fit_transform(tutors_df[["experience", "rating"]])
    num_sim = numerical_scaled.mean(axis=1)

    # ---- Location score ----
    def location_score(tutor_row, parent_location):
        if tutor_row["mode"] != "In-Person":
            return 0
        return 1 if str(tutor_row["location"]).lower() == str(parent_location).lower() else 0

    location_scores = tutors_df.apply(lambda row: location_score(row, request_dict["location"]), axis=1).values

    # ---- Weighted total score ----
    total_score = (0.4 * sim_subject) + (0.3 * sim_grade) + (0.1 * sim_mode) + (0.15 * num_sim) + (0.05 * location_scores)

    # ---- Top N results ----
    top_indexes = total_score.argsort()[-top_n:][::-1]
    recommended = tutors_df.iloc[top_indexes].copy()
    recommended["score"] = total_score[top_indexes]

    return recommended