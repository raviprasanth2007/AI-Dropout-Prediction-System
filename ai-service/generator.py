import pandas as pd
import numpy as np
import random
import math

def sigmoid(x, k=1.0, x0=0.0):
    """ Continuous smooth decay function for calculating probabilities. """
    return 1.0 / (1.0 + math.exp(-k * (x - x0)))

def generate_synthetic_data(num_records=10000):
    departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'Biotechnology', 'Artificial Intelligence and Machine Learning']
    genders = ['MALE', 'FEMALE', 'OTHER']
    accommodations = ['HOSTELLER', 'DAY_SCHOLAR']
    stress_levels = ['LOW', 'MEDIUM', 'HIGH']
    
    data = []
    
    # 35% Excellent, 30% Good, 20% Average, 10% Weak, 5% Critical
    archetype_weights = [0.35, 0.30, 0.20, 0.10, 0.05]
    archetypes = ['excellent', 'good', 'average', 'weak', 'critical']
    
    # We will reserve 5% of the total records for explicit edge cases
    num_edge_cases = int(num_records * 0.05)
    num_standard = num_records - num_edge_cases
    
    def bound(val, min_val, max_val):
        return max(min_val, min(max_val, val))

    # Generate Standard Students
    for _ in range(num_standard):
        record = {}
        record['studentId'] = f"REG{random.randint(100000, 999999)}"
        record['department'] = random.choice(departments)
        record['semester'] = random.randint(1, 8)
        
        archetype = random.choices(archetypes, weights=archetype_weights)[0]
        
        # Base independent feature: Attendance
        if archetype == 'excellent':
            attendance = np.random.normal(92, 5)
        elif archetype == 'good':
            attendance = np.random.normal(82, 5)
        elif archetype == 'average':
            attendance = np.random.normal(75, 5)
        elif archetype == 'weak':
            attendance = np.random.normal(65, 8)
        else: # critical
            attendance = np.random.normal(55, 10)
            
        attendance = bound(attendance, 10, 100)
        record['attendancePercentage'] = attendance
        
        # Chained Dependency: Attendance strongly influences Internal Marks and LMS Usage
        lms_base = attendance + np.random.normal(0, 10)
        record['lmsUsage'] = bound(lms_base, 0, 100)
        
        internal_base = attendance - 10 + np.random.normal(0, 5)
        if archetype in ['excellent', 'good']: internal_base += 10
        record['internalMarks'] = bound(internal_base, 0, 100)
        
        # Chained Dependency: Internal Marks influence Assignment Marks
        assignment_base = record['internalMarks'] + np.random.normal(0, 5)
        record['assignmentMarks'] = bound(assignment_base, 0, 100)
        
        # Chained Dependency: Overall marks dictate CGPA
        # Map 0-100 to 2.0-10.0 scale
        cgpa_base = (record['internalMarks'] * 0.6 + record['assignmentMarks'] * 0.4) / 10.0
        cgpa_base = cgpa_base + np.random.normal(0, 0.5)
        record['cgpa'] = bound(cgpa_base, 2.0, 10.0)
        
        # Chained Dependency: Low CGPA dictates Backlogs
        if record['cgpa'] > 8.5:
            backlogs = 0
        elif record['cgpa'] > 7.0:
            backlogs = random.choices([0, 1, 2], weights=[0.8, 0.15, 0.05])[0]
        elif record['cgpa'] > 6.0:
            backlogs = random.choices([0, 1, 2, 3], weights=[0.4, 0.3, 0.2, 0.1])[0]
        else:
            backlogs = random.randint(3, 8)
        record['backlogs'] = backlogs
        
        # Independent/Semi-dependent: Financials
        record['scholarship'] = True if record['cgpa'] > 9.0 and random.random() > 0.5 else False
        if record['scholarship']:
            fee_prob = [0.95, 0.05, 0.0]
        elif archetype in ['weak', 'critical']:
            fee_prob = [0.3, 0.4, 0.3]
        else:
            fee_prob = [0.7, 0.2, 0.1]
            
        record['feePending'] = random.choices([0, 25000, 100000], weights=fee_prob)[0]
        record['familyIncome'] = bound(np.random.normal(600000, 300000), 50000, 5000000)
        
        # Independent: Stress and Wellness
        stress = random.choices(['LOW', 'MEDIUM', 'HIGH'], weights=[0.4, 0.4, 0.2])[0]
        if archetype == 'critical' or record['feePending'] > 50000:
            stress = random.choices(['MEDIUM', 'HIGH'], weights=[0.2, 0.8])[0]
        record['stressLevel'] = stress
        
        # Chained Dependency: Stress drives Wellness, Behavior, and Counselling
        if stress == 'HIGH':
            wellness = np.random.normal(40, 15)
            behavior = np.random.normal(60, 20)
            counselling = True if random.random() > 0.4 else False
        elif stress == 'MEDIUM':
            wellness = np.random.normal(70, 15)
            behavior = np.random.normal(80, 10)
            counselling = True if random.random() > 0.8 else False
        else:
            wellness = np.random.normal(90, 10)
            behavior = np.random.normal(95, 5)
            counselling = False
            
        record['mentalWellnessScore'] = bound(wellness, 0, 100)
        record['behaviorScore'] = bound(behavior, 0, 100)
        record['counsellingHistory'] = counselling
        
        # Chained: Behavior drives Communication and Placement Training
        if record['behaviorScore'] > 80:
            record['communicationScore'] = bound(np.random.normal(85, 10), 0, 100)
            record['placementTraining'] = True if random.random() > 0.1 else False
        else:
            record['communicationScore'] = bound(np.random.normal(60, 20), 0, 100)
            record['placementTraining'] = True if random.random() > 0.5 else False
            
        record.update(_generate_remaining_generic_fields(record, accommodations, genders))
        data.append(record)
        
    # Generate Edge Cases
    for _ in range(num_edge_cases):
        record = {}
        record['studentId'] = f"REG{random.randint(100000, 999999)}"
        record['department'] = random.choice(departments)
        record['semester'] = random.randint(1, 8)
        
        edge_type = random.choice([
            'HighAtt_LowCGPA', 
            'LowAtt_HighCGPA', 
            'ExcBehav_PoorAcad', 
            'PoorBehav_ExcAcad', 
            'FeePend_ExcAcad', 
            'NoFee_MultiBacklog',
            'ExcAtt_HighStress',
            'GoodCGPA_RepCounselling'
        ])
        
        if edge_type == 'HighAtt_LowCGPA':
            record['attendancePercentage'] = bound(np.random.normal(95, 2), 90, 100)
            record['cgpa'] = bound(np.random.normal(5.0, 0.5), 4.0, 5.5)
            record['internalMarks'] = bound(np.random.normal(50, 5), 0, 100)
            record['assignmentMarks'] = bound(np.random.normal(90, 5), 0, 100) # does well in assignments but fails exams
            record['backlogs'] = random.randint(4, 6)
            record['behaviorScore'] = 90
            record['stressLevel'] = 'LOW'
            record['feePending'] = 0
        elif edge_type == 'LowAtt_HighCGPA':
            record['attendancePercentage'] = bound(np.random.normal(55, 5), 40, 60)
            record['cgpa'] = bound(np.random.normal(9.2, 0.3), 8.8, 10.0)
            record['internalMarks'] = 95
            record['assignmentMarks'] = 90
            record['backlogs'] = 0
            record['behaviorScore'] = 70
            record['stressLevel'] = 'LOW'
            record['feePending'] = 0
        elif edge_type == 'ExcBehav_PoorAcad':
            record['attendancePercentage'] = bound(np.random.normal(90, 5), 80, 100)
            record['cgpa'] = 4.5
            record['internalMarks'] = 40
            record['assignmentMarks'] = 80
            record['backlogs'] = 5
            record['behaviorScore'] = 98
            record['stressLevel'] = 'MEDIUM'
            record['feePending'] = 0
        elif edge_type == 'PoorBehav_ExcAcad':
            record['attendancePercentage'] = 65
            record['cgpa'] = 9.5
            record['internalMarks'] = 98
            record['assignmentMarks'] = 60
            record['backlogs'] = 0
            record['behaviorScore'] = 30
            record['stressLevel'] = 'HIGH'
            record['feePending'] = 0
        elif edge_type == 'FeePend_ExcAcad':
            record['attendancePercentage'] = 90
            record['cgpa'] = 9.1
            record['internalMarks'] = 90
            record['assignmentMarks'] = 90
            record['backlogs'] = 0
            record['behaviorScore'] = 90
            record['stressLevel'] = 'HIGH'
            record['feePending'] = 250000
        elif edge_type == 'NoFee_MultiBacklog':
            record['attendancePercentage'] = 80
            record['cgpa'] = 5.2
            record['internalMarks'] = 50
            record['assignmentMarks'] = 50
            record['backlogs'] = 6
            record['behaviorScore'] = 85
            record['stressLevel'] = 'LOW'
            record['feePending'] = 0
        elif edge_type == 'ExcAtt_HighStress':
            record['attendancePercentage'] = 98
            record['cgpa'] = 8.5
            record['internalMarks'] = 85
            record['assignmentMarks'] = 90
            record['backlogs'] = 0
            record['behaviorScore'] = 95
            record['stressLevel'] = 'HIGH'
            record['feePending'] = 0
        else: # GoodCGPA_RepCounselling
            record['attendancePercentage'] = 85
            record['cgpa'] = 8.0
            record['internalMarks'] = 80
            record['assignmentMarks'] = 80
            record['backlogs'] = 0
            record['behaviorScore'] = 50
            record['stressLevel'] = 'HIGH'
            record['feePending'] = 0

        # Fill in the rest randomly but bound appropriately
        if 'lmsUsage' not in record: record['lmsUsage'] = record['attendancePercentage']
        if 'mentalWellnessScore' not in record: record['mentalWellnessScore'] = 40 if record['stressLevel'] == 'HIGH' else 80
        record['counsellingHistory'] = True if record['stressLevel'] == 'HIGH' else False
        record['communicationScore'] = record['behaviorScore']
        record['placementTraining'] = True if record['cgpa'] > 7.0 else False
        record['scholarship'] = False
        if 'familyIncome' not in record: record['familyIncome'] = 500000
        
        record.update(_generate_remaining_generic_fields(record, accommodations, genders))
        data.append(record)

    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # -------------------------------------------------------------
    # CALCULATE DROPOUT PROBABILITY USING CONTINUOUS MATH FUNCTIONS
    # -------------------------------------------------------------
    
    # We construct a continuous 'logit' (z-score) combining factors.
    # A standard scaler approach but domain-weighted.
    
    # Attendance: logistic curve favoring higher values
    # e.g. 75% -> z=0, 50% -> z=-2.5, 90% -> z=1.5
    z_att = (df['attendancePercentage'] - 75.0) / 10.0
    
    # CGPA: logistic curve
    # e.g. 7.0 -> z=0, 5.0 -> z=-2, 9.0 -> z=2
    z_cgpa = (df['cgpa'] - 7.0) / 1.0
    
    # Backlogs: linear decay
    # e.g. 0 -> z=1.5, 3 -> z=-1.5, 6 -> z=-4.5
    z_back = (1.5 - df['backlogs']) / 1.0
    
    # Fee: Log penalty
    z_fee = -np.log1p(df['feePending']) / 12.0 # 100k -> ~-0.96
    
    # Behavior & Wellness
    z_beh = (df['behaviorScore'] - 75.0) / 15.0
    z_well = (df['mentalWellnessScore'] - 70.0) / 15.0
    
    # Combined base margin (higher is better standing, lower is higher risk)
    # Weights: Attendance (0.3), CGPA (0.3), Backlogs (0.25), Fee (0.05), Behavior (0.05), Wellness (0.05)
    margin = (z_att * 0.3) + (z_cgpa * 0.3) + (z_back * 0.25) + (z_fee * 0.05) + (z_beh * 0.05) + (z_well * 0.05)
    
    # We want dropout probability to rise as margin falls.
    # Convert margin to dropout probability using a Sigmoid function
    # k controls the steepness. k=2 gives a nice smooth S-curve.
    # We shift x0 slightly so that a 0 margin (average student) has a low baseline dropout (~10%)
    
    def smooth_dropout_prob(m):
        # High margin -> low dropout. Negative margin -> high dropout
        # P(Dropout) = 1 / (1 + exp(k * (m - shift)))
        k = 2.5 
        shift = -1.0 # The margin at which dropout probability is 50%
        return 1.0 / (1.0 + math.exp(k * (m - shift)))

    dropout_probs = margin.apply(smooth_dropout_prob)
    
    # Sample dropout boolean based strictly on continuous probability to create a perfectly balanced dataset
    df['dropout_prob'] = dropout_probs
    df['dropout'] = df['dropout_prob'].apply(lambda p: True if random.random() < p else False)
    
    # Drop the temporary probability column as the ML model should learn it from the boolean targets
    df = df.drop(columns=['dropout_prob'])

    # Formatting cleanup
    for col in df.select_dtypes(include=['float64']).columns:
        df[col] = df[col].round(2)
        
    return df

def _generate_remaining_generic_fields(record, accommodations, genders):
    return {
        'libraryUsage': max(0.0, min(100.0, record.get('libraryUsage', np.random.normal(50, 20)))),
        'extracurricular': random.choice([True, False]),
        'medicalIssues': random.choice([True, False]),
        'parentInteraction': max(0.0, min(100.0, np.random.normal(60, 20))),
        'facultyFeedbackScore': max(0.0, min(100.0, record['behaviorScore'] + np.random.normal(0, 10))),
        'gender': random.choice(genders),
        'age': random.randint(18, 24),
        'previousSemesterGpa': max(0.0, min(10.0, record['cgpa'] + np.random.normal(0, 0.5))),
        'projectsCompleted': random.randint(0, 5),
        'internships': random.randint(0, 3),
        'codingSkillScore': max(0.0, min(100.0, record['cgpa'] * 10 + np.random.normal(0, 10))),
        'leadershipScore': max(0.0, min(100.0, np.random.normal(50, 25))),
        'sleepHours': max(2.0, min(12.0, np.random.normal(6, 1.5))),
        'partTimeJob': random.choice([True, False])
    }

if __name__ == "__main__":
    df = generate_synthetic_data(10)
    print(df[['attendancePercentage', 'cgpa', 'backlogs', 'feePending', 'dropout']])
