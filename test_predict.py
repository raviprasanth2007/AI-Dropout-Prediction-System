import requests
import json

test_student_1 = {
    "studentId": "TEST001",
    "department": "CSE",
    "semester": 6,
    "attendancePercentage": 70,
    "cgpa": 9.3,
    "backlogs": 0,
    "feePending": 0,
    "internalMarks": 85,
    "assignmentMarks": 85,
    "behaviorScore": 85,
    "mentalWellnessScore": 80,
    "stressLevel": "LOW",
    "communicationScore": 80,
    "libraryUsage": 60,
    "lmsUsage": 80,
    "extracurricular": True,
    "hackathonParticipation": True,
    "placementTraining": True,
    "counsellingHistory": False
}

test_student_2 = {
    "studentId": "TEST002",
    "department": "CSE",
    "semester": 6,
    "attendancePercentage": 95,
    "cgpa": 4.8,
    "backlogs": 6,
    "feePending": 100000,
    "internalMarks": 40,
    "assignmentMarks": 40,
    "behaviorScore": 40,
    "mentalWellnessScore": 40,
    "stressLevel": "HIGH",
    "communicationScore": 40,
    "libraryUsage": 20,
    "lmsUsage": 20,
    "extracurricular": False,
    "hackathonParticipation": False,
    "placementTraining": False,
    "counsellingHistory": True
}

url = 'http://localhost:8000/predict'
print("Testing Student 1 (Excellent Academic, Low Attendance):")
res1 = requests.post(url, json={"student_data": test_student_1})
print(json.dumps(res1.json(), indent=2))

print("\nTesting Student 2 (Poor Academic, High Attendance):")
res2 = requests.post(url, json={"student_data": test_student_2})
print(json.dumps(res2.json(), indent=2))
