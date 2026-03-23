# ===========================================
# Advanced Content-Based Tutor Recommender (Location String)
# ===========================================

import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# -----------------------------
# Step 2: Tutor Data
# -----------------------------
tutors = pd.DataFrame([
    ["Math", "Middle School", "Online", 5, 4.8, "Ferensay"],
    ["Physics", "High School", "Online", 3, 4.5, "Alem bank"],
    ["English", "Elementary", "In-person", 6, 4.9, "Bole"],
    ["Math", "Elementary", "Online", 2, 4.2, "Adisu Gebeya"],
    ["Chemistry", "High School", "Online", 4, 4.7, "Bole"],
    ["Math", "Middle School", "In-person", 3, 4.1, "Megenagna"]
], columns=["subject","grade_level","mode","experience","rating","location"])

# -----------------------------
# Step 3: Parent Request
# -----------------------------
request = {
    "subject": "Math",
    "grade_level": "Middle School",
    "mode": "Online",
    "location": "Bole"
}

# -----------------------------
# Step 4: Encode Categorical Features (including location)
# -----------------------------

encoder_subject = OneHotEncoder()
encoder_grade = OneHotEncoder()
encoder_mode = OneHotEncoder()
encoder_location = OneHotEncoder()

# Fit each encoder on tutors + parent
subject_combined = pd.concat([tutors[["subject"]], pd.DataFrame([[request["subject"]]], columns=["subject"])])
grade_combined = pd.concat([tutors[["grade_level"]], pd.DataFrame([[request["grade_level"]]], columns=["grade_level"])])
mode_combined = pd.concat([tutors[["mode"]], pd.DataFrame([[request["mode"]]], columns=["mode"])])
location_combined = pd.concat([tutors[["location"]], pd.DataFrame([[request["location"]]], columns=["location"])])

subject_encoded = encoder_subject.fit_transform(subject_combined).toarray()
grade_encoded = encoder_grade.fit_transform(grade_combined).toarray()
mode_encoded = encoder_mode.fit_transform(mode_combined).toarray()
location_encoded = encoder_location.fit_transform(location_combined).toarray()

tutor_subject = subject_encoded[:-1]
tutor_grade = grade_encoded[:-1]
tutor_mode = mode_encoded[:-1]
tutor_location = location_encoded[:-1]

parent_subject = subject_encoded[-1].reshape(1,-1)
parent_grade = grade_encoded[-1].reshape(1,-1)
parent_mode = mode_encoded[-1].reshape(1,-1)
parent_location = location_encoded[-1].reshape(1,-1)

# Compute cosine similarities
sim_subject = cosine_similarity(parent_subject, tutor_subject)[0]
sim_grade = cosine_similarity(parent_grade, tutor_grade)[0]
sim_mode = cosine_similarity(parent_mode, tutor_mode)[0]
sim_location = cosine_similarity(parent_location, tutor_location)[0]

# -----------------------------
# Step 5: Numerical Features Similarity (experience + rating)
# -----------------------------
scaler = MinMaxScaler()
numerical = tutors[["experience","rating"]]
numerical_scaled = scaler.fit_transform(numerical)

# Replace numerical similarity step
num_sim = numerical_scaled.sum(axis=1) / numerical_scaled.shape[1]  # average of experience + rating

# -----------------------------
# Step 6: Location Matching
# -----------------------------
def location_score(tutor_row, parent_location):
    if tutor_row["mode"] != "In-person":
        return 0  # only care about in-person tutors
    return 1 if tutor_row["location"].lower() == parent_location.lower() else 0

location_scores = tutors.apply(lambda row: location_score(row, request["location"]), axis=1)

# -----------------------------
# Step 7: Weighted Total Score
# -----------------------------
# Assign more weight to subject & grade
w_subject = 0.4
w_grade = 0.3
w_mode = 0.1
w_num = 0.15
w_loc = 0.05   # only matters for in-person

total_score = (
    w_subject * sim_subject +
    w_grade * sim_grade +
    w_mode * sim_mode +
    w_num * num_sim +
    w_loc * location_scores
)

# -----------------------------
# Step 8: Top N Tutors
# -----------------------------
top_n = 3
top_indexes = total_score.argsort()[-top_n:][::-1]
recommended = tutors.iloc[top_indexes].copy()
recommended["score"] = total_score[top_indexes]

print("=== Top Recommended Tutors ===")
print(recommended)

