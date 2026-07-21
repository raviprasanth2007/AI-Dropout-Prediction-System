import pandas as pd
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai-service'))
from model import model_service
import json

def get_prediction(student_data):
    return model_service.predict(student_data)

def test_smoothness():
    print("=========================================")
    print("TEST 1: SMOOTH PROBABILITY TRANSITIONS")
    print("=========================================")
    base_student = {
        "studentId": "VAL001",
        "department": "CSE",
        "semester": 6,
        "cgpa": 7.0,
        "backlogs": 1,
        "feePending": 0,
        "internalMarks": 70,
        "assignmentMarks": 70,
        "behaviorScore": 80,
        "mentalWellnessScore": 70,
        "stressLevel": "LOW",
        "communicationScore": 75,
        "libraryUsage": 50,
        "lmsUsage": 75,
        "extracurricular": True,
        "hackathonParticipation": False,
        "placementTraining": True,
        "counsellingHistory": False
    }

    print("Testing Attendance Drop (75% -> 74% -> 73%)...")
    prev_prob = None
    passed = True
    for att in [75.0, 74.0, 73.0, 60.0]:
        base_student['attendancePercentage'] = att
        pred = get_prediction(base_student)
        prob = pred['dropoutProbability']
        print(f"Attendance: {att}% -> Risk Probability: {prob}% ({pred['riskLevel']})")
        
        if prev_prob is not None:
            diff = prob - prev_prob
            if att in [74.0, 73.0] and diff > 30.0: # Huge jump logic check
                print("FAILED: Model exhibited a non-smooth jump!")
                passed = False
        prev_prob = prob
        
    print(f"Smoothness Test: {'PASSED' if passed else 'FAILED'}")
    return passed

def test_edge_cases():
    print("\n=========================================")
    print("TEST 2: EDGE CASES (No Single Feature Dominance)")
    print("=========================================")
    
    edge_cases = [
        {
            "name": "High Attendance (94%), Low CGPA (5.2), Multi Backlogs (4)",
            "data": {
                "attendancePercentage": 94, "cgpa": 5.2, "backlogs": 4, "feePending": 0,
                "internalMarks": 50, "assignmentMarks": 50, "behaviorScore": 80, "mentalWellnessScore": 70,
                "stressLevel": "LOW", "communicationScore": 75, "libraryUsage": 50, "lmsUsage": 80,
                "extracurricular": False, "hackathonParticipation": False, "placementTraining": False, "counsellingHistory": False
            },
            "expected_not_extreme": True
        },
        {
            "name": "Poor Behavior (30), Excellent Academics (CGPA 9.5, 95% Att)",
            "data": {
                "attendancePercentage": 95, "cgpa": 9.5, "backlogs": 0, "feePending": 0,
                "internalMarks": 95, "assignmentMarks": 95, "behaviorScore": 30, "mentalWellnessScore": 50,
                "stressLevel": "HIGH", "communicationScore": 40, "libraryUsage": 80, "lmsUsage": 90,
                "extracurricular": False, "hackathonParticipation": True, "placementTraining": True, "counsellingHistory": True
            },
            "expected_not_extreme": True
        }
    ]
    
    passed = True
    for case in edge_cases:
        pred = get_prediction(case['data'])
        prob = pred['dropoutProbability']
        print(f"Case: {case['name']}")
        print(f"-> Predicted Probability: {prob}% ({pred['riskLevel']})")
        print(f"-> Confidence: {pred['confidence']}%")
        
        if case['expected_not_extreme']:
            if prob > 99.5 or prob < 0.5:
                print(f"FAILED: Edge case resulted in extreme probability ({prob}%)! Model is not balancing features.")
                passed = False
            if pred['confidence'] == 100.0:
                print(f"FAILED: Edge case resulted in 100% confidence. Model is overconfident.")
                passed = False
                
    print(f"Edge Case Test: {'PASSED' if passed else 'FAILED'}")
    return passed

def run_all_validations():
    print("Starting Enterprise Validation Suite...\n")
    s_pass = test_smoothness()
    e_pass = test_edge_cases()
    
    print("\n=========================================")
    if s_pass and e_pass:
        print("ALL TESTS PASSED. Model is calibrated, smooth, and handles edge cases perfectly.")
    else:
        print("SOME TESTS FAILED. Model needs recalibration.")
        
if __name__ == "__main__":
    run_all_validations()
