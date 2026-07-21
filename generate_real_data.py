import pandas as pd
import numpy as np
import random

raw_data = """
32	7376222BT195	SRIVARSHINI S	Biotechnology	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. BALAKRISHNARAJA R BIOTECH					
33	7376222BT211	VEDHA SHRI A S	Biotechnology	Loading...	2025-06-02	2025-09-30	91	65.5	25.5	71.98	Dr. BALAKRISHNARAJA R BIOTECH					
43	7376222BT146	KAVIYA M	Biotechnology	Loading...	2025-06-02	2025-09-30	91	67	24	73.63	Dr. BALAKRISHNARAJA R BIOTECH					
44	7376222BT128	HARINI MIRUTHULA S	Biotechnology	Loading...	2025-06-02	2025-09-30	91	62.5	28.5	68.68	Dr. BALAKRISHNARAJA R BIOTECH					
84	7376222BT193	SOWNDARYA LAKSHMI S G	Biotechnology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. BALAKRISHNARAJA R BIOTECH					
85	7376222BT152	KRISHNAN A	Biotechnology	Loading...	2025-06-02	2025-09-30	91	0	91	0	Dr. BALAKRISHNARAJA R BIOTECH					
10	7376222AL154	KAVID KISHORE B	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. BHARATHI A AIML					
11	7376222AL145	JAI KRISHNA S K	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. BHARATHI A AIML					
12	7376222AL140	HARISH R	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. BHARATHI A AIML					
13	7376222AL135	GOWTHAM BALA K	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	71	20	78.02	Dr. BHARATHI A AIML					
14	7376222AL152	KARTHICK KUMAR A M	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	66.5	24.5	73.08	Dr. BHARATHI A AIML					
15	7376222AL150	KALAIYARASAN V	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	57	34	62.64	Dr. BHARATHI A AIML					
87	7376222AL187	ROHITH V S	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. BHARATHI A AIML					
92	7376222AL169	MANOBHARATHI S	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. BHARATHI A AIML					
93	7376222AL171	MITHUN S K	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	58	33	63.74	Dr. BHARATHI A AIML					
98	7376222AL223	YAZHINI K	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. BHARATHI A AIML					
99	7376232AL510	SRIDHAR C	Artificial Intelligence and Machine Learning	Loading...	2025-06-02	2025-09-30	91	66	25	72.53	Dr. BHARATHI A AIML					
49	7376222AG116	FAZALAHAMED S J	Agricultural Engineering	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. CHELLADURAI V AGRI					
65	7376222AG147	RAHUL S	Agricultural Engineering	Loading...	2025-06-02	2025-09-30	91	71	20	78.02	Dr. CHELLADURAI V AGRI					
66	7376222AG157	VASUNTHARA DEVI R	Agricultural Engineering	Loading...	2025-06-02	2025-09-30	91	65.5	25.5	71.98	Dr. CHELLADURAI V AGRI					
1	7376221SE115	GIRIDHARAN S	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. ESWARAMOORTHY V AIDS	Yes	Yes		Yes	
2	7376221SE131	NAVEEN KUMAR N	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	69	22	75.82	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes	Yes	
3	7376221SE117	JAISRI M	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	68.5	22.5	75.27	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes	Yes	
4	7376221SE140	RAMAN KISHORE R	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	67.5	23.5	74.18	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes	Yes	
48	7376232CT503	SATHISH S	Computer Technology	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes	Yes	
58	7376221SE157	VISHAL S	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes		
59	7376221SE150	SRIRAM SIDDHARTH S	Information Science and Engineering	Loading...	2025-06-02	2025-09-30	91	68.5	22.5	75.27	Dr. ESWARAMOORTHY V AIDS	Yes				
60	7376222CT131	MITHUN HARSHAD R S	Computer Technology	Loading...	2025-06-02	2025-09-30	91	69	22	75.82	Dr. ESWARAMOORTHY V AIDS	Yes	Yes	Yes	Yes	
91	7376222CT140	PRADEEP T T	Computer Technology	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. ESWARAMOORTHY V AIDS	Yes				
42	7376222AD187	RITHIKA R	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. GOMATHI R AIDS					
55	7376222AD156	KIRUTHIKA C K	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	71	20	78.02	Dr. GOMATHI R AIDS					
69	7376222AD211	SUHITHA SHREE J S	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
74	7376222AD130	DHINAKAR H	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
75	7376222AD123	DHARANI DHARAN A	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	68.5	22.5	75.27	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
76	7376222AD131	DHIVYA P	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	57.5	33.5	63.19	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
77	7376222AD120	BALAJI P	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	7	84	7.69	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
96	7376222AD178	RAHEESH A	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. GOMATHI R AIDS					
97	7376222AD186	RITHIK M	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	69.5	21.5	76.37	Dr. GOMATHI R AIDS					
100	7376222AD108	ADHISAYAN J P	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	69	22	75.82	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
101	7376222AD111	AKASH K	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	67.5	23.5	74.18	Dr. GOMATHI R AIDS	Yes	Yes	Yes	Yes	
102	7376232AD502	DHANUSH R	Artificial Intelligence and Data Science	Loading...	2025-06-02	2025-09-30	91	0	91	0	Dr. GOMATHI R AIDS					
81	7376232TX515	YESWANTHKUMAR P	Textile Technology	Loading...	2025-06-02	2025-09-30	91	68	23	74.73	Dr. JANARTHANAN M TEXTILE					
82	7376232TX508	MUHAMMADH AATHIF A	Textile Technology	Loading...	2025-06-02	2025-09-30	91	67.5	23.5	74.18	Dr. JANARTHANAN M TEXTILE					
37	7376221MC127	MOHAMED ASLAM G	Mechatronics	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. JEGADHEESWARAN S MTRS					
38	7376231MC501	AADHEESH M	Mechatronics	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. JEGADHEESWARAN S MTRS	Yes	Yes	Yes	Yes	
39	7376221MC142	SATH GURU S	Mechatronics	Loading...	2025-06-02	2025-09-30	91	67.5	23.5	74.18	Dr. JEGADHEESWARAN S MTRS	Yes	Yes	Yes	Yes	
7	7376221ME138	SAMUEL S	Mechanical Engineering	Loading...	2025-06-02	2025-09-30	91	55.5	35.5	60.99	Dr. KUMARESAN G MECH					
16	7376221ME117	DHARANIPRIYAN L	Mechanical Engineering	Loading...	2025-06-02	2025-09-30	91	68.5	22.5	75.27	Dr. KUMARESAN G MECH					
21	7376221ME114	BHARATH K P	Mechanical Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. KUMARESAN G MECH					
68	201ME153	MUKESH C	Mechanical Engineering	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. KUMARESAN G MECH					
22	7376222IT129	DHARANEESH R S	Information Technology	Loading...	2025-06-02	2025-09-30	91	61.5	29.5	67.58	Dr. NAVEENA S IT					
23	7376222IT142	GOWTHAM M P	Information Technology	Loading...	2025-06-02	2025-09-30	91	47.5	43.5	52.2	Dr. NAVEENA S IT					
45	7376232IT502	ARUNESH S M	Information Technology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. NAVEENA S IT					
46	7376232IT507	JAIPRASHANTH M	Information Technology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. NAVEENA S IT					
47	7376232IT506	GOWTHAM M	Information Technology	Loading...	2025-06-02	2025-09-30	91	65.5	25.5	71.98	Dr. NAVEENA S IT					
50	7376222IT110	ARIKARTHIK S	Information Technology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. NAVEENA S IT					
52	7376222IT258	SRI HARI D	Information Technology	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. NAVEENA S IT					
53	7376222IT277	VASUKI A	Information Technology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. NAVEENA S IT					
54	7376222IT264	SUDHIR RAJ P	Information Technology	Loading...	2025-06-02	2025-09-30	91	69.5	21.5	76.37	Dr. NAVEENA S IT					
56	7376222IT164	KANITHA CHELLAM V	Information Technology	Loading...	2025-06-02	2025-09-30	91	67	24	73.63	Dr. NAVEENA S IT					
71	7376222IT213	NETHAJI P	Information Technology	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. NAVEENA S IT					
72	7376222IT229	RAHUL N	Information Technology	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. NAVEENA S IT					
86	7376222IT245	SANJAY P	Information Technology	Loading...	2025-06-02	2025-09-30	91	54.5	36.5	59.89	Dr. NAVEENA S IT					
94	7376222IT177	KISHORE S	Information Technology	Loading...	2025-06-02	2025-09-30	91	71	20	78.02	Dr. NAVEENA S IT					
95	7376222IT175	KISHORE B	Information Technology	Loading...	2025-06-02	2025-09-30	91	62.5	28.5	68.68	Dr. NAVEENA S IT					
8	7376221EC273	RANJITH RAGAVENDAR J	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. PRAKASH S P ECE					
9	7376231EC518	SURENDHAR R	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. PRAKASH S P ECE					
17	7376221EC251	NITHIYA VARSHINI P J	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. PRAKASH S P ECE					
18	7376221EC253	NIVETHITHA B	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. PRAKASH S P ECE					
31	7376221EC107	ABIVARMA N	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	58.5	32.5	64.29	Dr. PRAKASH S P ECE					
34	7376221EC157	FATHIMA ZUHAIRA S M	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. PRAKASH S P ECE					
35	7376221EC148	DHARUNRAJ V	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	69.5	21.5	76.37	Dr. PRAKASH S P ECE					
36	7376221EC192	KARTHICK JAYASURYA M	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	65.5	25.5	71.98	Dr. PRAKASH S P ECE					
51	7376221EC216	MANO VARSHA S	Electronics and Communication Engineering	Loading...	2025-06-02	2025-09-30	91	71	20	78.02	Dr. PRAKASH S P ECE					
19	7376221CS142	DHARANISWARAN M	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	66	25	72.53	Dr. SASIKALA D CSE					
20	7376221CS148	EDWIN RAJ S	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	53.5	37.5	58.79	Dr. SASIKALA D CSE					
24	7376221CS104	ABISHEK I	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. SASIKALA D CSE					
25	7376221CS114	ARUN KUMAR V	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	64.5	26.5	70.88	Dr. SASIKALA D CSE					
57	7376221CS335	THARUN KIRUTHIK K S	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	67	24	73.63	Dr. SASIKALA D CSE					
64	7376221CS179	JEGATH PRANAVA M	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. SASIKALA D CSE					
70	7376221CS324	SUNIL G	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. SASIKALA D CSE					
73	7376221CS257	POOVARASAN V	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	62.5	28.5	68.68	Dr. SASIKALA D CSE					
78	7376221CS275	RAGUPRADAP M	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	54.5	36.5	59.89	Dr. SASIKALA D CSE					
80	7376221CS348	VISHAAL T D	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	70	21	76.92	Dr. SASIKALA D CSE					
83	7376221CS229	MONAASHREE P	Computer Science and Engineering	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. SASIKALA D CSE					
6	7376221BM149	VINITH S	Biomedical Engineering	Loading...	2025-06-02	2025-09-30	91	70.5	20.5	77.47	Dr. VAIRAVEL K S EIE					
26	7376221EI150	SIVAPRAKASH N	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	71.5	19.5	78.57	Dr. VAIRAVEL K S EIE					
27	7376221EI151	SRIRAM KARTHIK V	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	69	22	75.82	Dr. VAIRAVEL K S EIE					
28	7376231EI501	AKASH R	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	63	28	69.23	Dr. VAIRAVEL K S EIE					
29	7376231EI503	KIRITHIS V	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	63	28	69.23	Dr. VAIRAVEL K S EIE					
30	7376231EI502	KARTHIKRAJ S V	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	43	48	47.25	Dr. VAIRAVEL K S EIE					
40	7376221EI113	GANESH PANDI R	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. VAIRAVEL K S EIE					
41	7376221EI117	JAYAMURUGAN V M	Electronics and Instrumentation Engineering	Loading...	2025-06-02	2025-09-30	91	70	21	76.92	Dr. VAIRAVEL K S EIE					
61	7376221CD102	AMRITHA V	Computer Science and Design	Loading...	2025-06-02	2025-09-30	91	63.5	27.5	69.78	Dr. VENKATESAN R IT					
62	7376221CD114	GUKAN K	Computer Science and Design	Loading...	2025-06-02	2025-09-30	91	63.5	27.5	69.78	Dr. VENKATESAN R IT					
63	7376221CD126	MONESH J	Computer Science and Design	Loading...	2025-06-02	2025-09-30	91	54.5	36.5	59.89	Dr. VENKATESAN R IT					
67	7376232CB501	DINESH R	Computer Science and Business Systems	Loading...	2025-06-02	2025-09-30	91	69.5	21.5	76.37	Dr. VENKATESAN R IT					
88	7376222CB120	KANISH J	Computer Science and Business Systems	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Dr. VENKATESAN R IT					
89	7376222CB116	HARITH A P	Computer Science and Business Systems	Loading...	2025-06-02	2025-09-30	91	72	19	79.12	Dr. VENKATESAN R IT					
90	7376222CB117	JAISURYA M	Computer Science and Business Systems	Loading...	2025-06-02	2025-09-30	91	68.5	22.5	75.27	Dr. VENKATESAN R IT					
5	7376222FD125	JAYANTHAN RAJAMANI B	Food Technology	Loading...	2025-06-02	2025-09-30	91	72.5	18.5	79.67	Mr. GOWRISHANKAR L FOOD	Yes	Yes		Yes	
79	7376222FT115	SASVANTH S	Fashion Technology	Loading...	2025-06-02	2025-09-30	91	61	30	67.03	Mrs. SARANYA D V FASHION		
"""

lines = [line.strip() for line in raw_data.strip().split('\n') if line.strip()]
data = []

dept_map = {
    'Biotechnology': 'BT',
    'Artificial Intelligence and Machine Learning': 'AIML',
    'Agricultural Engineering': 'AGRI',
    'Information Science and Engineering': 'ISE',
    'Computer Technology': 'CT',
    'Artificial Intelligence and Data Science': 'AIDS',
    'Textile Technology': 'TEXTILE',
    'Mechatronics': 'MTRS',
    'Mechanical Engineering': 'MECH',
    'Information Technology': 'IT',
    'Electronics and Communication Engineering': 'ECE',
    'Computer Science and Engineering': 'CSE',
    'Biomedical Engineering': 'BME',
    'Electronics and Instrumentation Engineering': 'EIE',
    'Computer Science and Design': 'CSD',
    'Computer Science and Business Systems': 'CSBS',
    'Food Technology': 'FOOD',
    'Fashion Technology': 'FASHION'
}

for line in lines:
    parts = line.split('\t')
    if len(parts) < 11:
        continue
    
    studentId = parts[1].strip()
    name = parts[2].strip()
    dept_full = parts[3].strip()
    department = dept_map.get(dept_full, dept_full)
    
    attendance = float(parts[10].strip())
    
    genders = ['MALE', 'FEMALE', 'OTHER']
    accommodations = ['HOSTELLER', 'DAY_SCHOLAR']
    stress_levels = ['LOW', 'MEDIUM', 'HIGH']
    
    dropout_prob = 0.05
    if attendance < 60:
        dropout_prob += 0.3
        
    cgpa = np.random.normal(7.0, 1.5)
    cgpa = max(2.0, min(10.0, cgpa))
    if cgpa < 5.0:
        dropout_prob += 0.2
        
    fee_pending = np.random.choice([0, 50000, 100000, 200000], p=[0.7, 0.15, 0.1, 0.05])
    if fee_pending > 50000:
        dropout_prob += 0.2
        
    family_income = np.random.normal(500000, 300000)
    family_income = max(50000, family_income)
    if family_income < 200000:
        dropout_prob += 0.15
        
    stress = random.choice(stress_levels)
    if stress == 'HIGH':
        dropout_prob += 0.1
        
    lms_usage = np.random.normal(50, 30)
    lms_usage = max(0, min(100, lms_usage))
    if lms_usage < 20:
        dropout_prob += 0.1
        
    dropout = True if random.random() < dropout_prob else False
    
    if dropout:
        internal_marks = np.random.normal(40, 15)
        assignment_marks = np.random.normal(40, 15)
        backlogs = np.random.randint(2, 8)
        behavior_score = np.random.normal(40, 20)
        mental_wellness = np.random.normal(40, 20)
    else:
        internal_marks = np.random.normal(70, 15)
        assignment_marks = np.random.normal(75, 15)
        backlogs = np.random.randint(0, 3)
        behavior_score = np.random.normal(80, 15)
        mental_wellness = np.random.normal(75, 15)
        
    internal_marks = max(0, min(100, internal_marks))
    assignment_marks = max(0, min(100, assignment_marks))
    behavior_score = max(0, min(100, behavior_score))
    mental_wellness = max(0, min(100, mental_wellness))
    
    record = {
        'studentId': studentId,
        'department': department,
        'semester': 6,
        'attendancePercentage': attendance,
        'internalMarks': round(internal_marks, 2),
        'assignmentMarks': round(assignment_marks, 2),
        'cgpa': round(cgpa, 2),
        'backlogs': backlogs,
        'scholarship': random.choice([True, False]),
        'feePending': fee_pending,
        'familyIncome': round(family_income, 2),
        'travelDistance': round(max(1.0, np.random.normal(15, 10)), 1),
        'accommodation': random.choice(accommodations),
        'internetAccess': random.choice([True, False]),
        'studyHours': round(max(0.0, np.random.normal(4, 2)), 1),
        'placementTraining': random.choice([True, False]),
        'libraryUsage': round(max(0.0, np.random.normal(20, 15)), 1),
        'lmsUsage': round(lms_usage, 1),
        'extracurricular': random.choice([True, False]),
        'counsellingHistory': random.choice([True, False]) if dropout else False,
        'medicalIssues': random.choice([True, False]) if dropout else False,
        'mentalWellnessScore': round(mental_wellness, 2),
        'behaviorScore': round(behavior_score, 2),
        'parentInteraction': round(max(0.0, min(100.0, np.random.normal(60, 20))), 2),
        'facultyFeedbackScore': round(max(0.0, min(100.0, np.random.normal(60, 20))), 2),
        'gender': random.choice(genders),
        'age': random.randint(18, 24),
        'previousSemesterGpa': round(max(0.0, min(10.0, cgpa + np.random.normal(0, 0.5))), 2),
        'projectsCompleted': random.randint(0, 5),
        'hackathonParticipation': random.choice([True, False]),
        'internships': random.randint(0, 3),
        'codingSkillScore': round(max(0.0, min(100.0, np.random.normal(60, 20))), 2),
        'communicationScore': round(max(0.0, min(100.0, np.random.normal(60, 20))), 2),
        'leadershipScore': round(max(0.0, min(100.0, np.random.normal(50, 25))), 2),
        'stressLevel': stress,
        'sleepHours': round(max(2.0, min(12.0, np.random.normal(6, 1.5))), 1),
        'partTimeJob': random.choice([True, False]),
        'dropout': dropout
    }
    data.append(record)

df = pd.DataFrame(data)
df.to_csv('d:/AI Dropout Prediction System/students_dataset.csv', index=False)
print(f"Saved {len(df)} rows to students_dataset.csv")
