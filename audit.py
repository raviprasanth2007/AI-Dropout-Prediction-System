import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai-service'))
import requests
import json
from model import model_service

student_data = {
    "studentId": "TEST_AUDIT",
    "department": "CSE",
    "semester": 6,
    "attendancePercentage": 74.18,
    "cgpa": 7.84,
    "backlogs": 2,
    "feePending": 2700,
    "internalMarks": 75,
    "assignmentMarks": 75,
    "behaviorScore": 85,
    "mentalWellnessScore": 80,
    "stressLevel": "LOW",
    "communicationScore": 80,
    "libraryUsage": 60,
    "lmsUsage": 75,
    "extracurricular": True,
    "hackathonParticipation": False,
    "placementTraining": True,
    "counsellingHistory": False
}

print("=====================================================")
print("PHASE 1 & 2: VERIFYING MODEL LOADED IN FASTAPI SERVER")
print("=====================================================")
try:
    res = requests.post("http://localhost:8000/predict", json={"student_data": student_data})
    api_result = res.json()
    print("API RESULT:")
    print(json.dumps(api_result, indent=2))
except Exception as e:
    print("API Error:", e)

print("\n=====================================================")
print("PHASE 3: VERIFYING LOCAL CALIBRATED MODEL (DIRECT)")
print("=====================================================")
try:
    local_result = model_service.predict(student_data)
    print("LOCAL PREDICT RESULT:")
    print(json.dumps(local_result, indent=2))
except Exception as e:
    print("Local Predict Error:", e)

