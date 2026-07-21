import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai-service'))
import pandas as pd
import numpy as np
from model import model_service  # type: ignore
from generator import generate_synthetic_data  # type: ignore

print("=====================================================")
print("PHASE 6: DATASET AUDIT")
print("=====================================================")
# Generate fresh dataset using new continuous logic
df = generate_synthetic_data(1000)

att_under_75 = df[df['attendancePercentage'] < 75]
att_74_76 = df[(df['attendancePercentage'] >= 74) & (df['attendancePercentage'] <= 76)]
cgpa_7_8 = df[(df['cgpa'] >= 7.0) & (df['cgpa'] <= 8.0)]
backlogs_2 = df[df['backlogs'] == 2]

print(f"Attendance < 75: Total={len(att_under_75)}, Dropout={att_under_75['dropout'].sum()}")
print(f"Attendance 74-76: Total={len(att_74_76)}, Dropout={att_74_76['dropout'].sum()}")
print(f"CGPA 7-8: Total={len(cgpa_7_8)}, Dropout={cgpa_7_8['dropout'].sum()}")
print(f"Backlogs = 2: Total={len(backlogs_2)}, Dropout={backlogs_2['dropout'].sum()}")

print("\n=====================================================")
print("PHASE 7 & 8: PROBABILITY DISTRIBUTION & BOUNDARY")
print("=====================================================")

probs = []
for idx, row in df.iterrows():
    # convert row to dict
    student_dict = row.to_dict()
    res = model_service.predict(student_dict)
    probs.append(res['dropoutProbability'])

# Print histogram
hist, bins = np.histogram(probs, bins=10, range=(0, 100))
print("Probability Histogram (bins of 10%):")
for i in range(10):
    print(f"{int(bins[i]):02d}% - {int(bins[i+1]):02d}% : {'*' * (hist[i] // 10)} ({hist[i]})")

extreme_0 = sum(1 for p in probs if p < 0.5)
extreme_100 = sum(1 for p in probs if p > 99.5)
print(f"Extreme 0% predictions (<0.5%): {extreme_0}")
print(f"Extreme 100% predictions (>99.5%): {extreme_100}")

print("\nBoundary Validation (Attendance 75% -> 71%):")
base = df.iloc[0].to_dict()
base['cgpa'] = 7.5
base['backlogs'] = 1
for att in [75.0, 74.0, 73.0, 72.0, 71.0]:
    base['attendancePercentage'] = att
    res = model_service.predict(base)
    print(f"Attendance {att}% -> Risk {res['dropoutProbability']}%")

print("\n=====================================================")
print("PHASE 9: FEATURE CONTRIBUTION (SHAP)")
print("=====================================================")
print("SHAP output for test student:")
for sv in res['shapValues'][:5]:
    print(f"Feature: {sv['feature']}, Contribution: {sv['contribution']:.4f}")

