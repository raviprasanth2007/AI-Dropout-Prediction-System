import pandas as pd
import json

df = pd.read_csv('d:/AI Dropout Prediction System/students_dataset.csv')

# Convert everything to appropriate types, handle NaN
df = df.fillna(0)

# Convert boolean strings/ints to booleans if needed (pandas might already do this)
# Some columns might need explicit mapping

records = df.to_dict(orient='records')
with open('d:/AI Dropout Prediction System/backend/prisma/students.json', 'w') as f:
    json.dump(records, f, indent=2)

print("Created backend/prisma/students.json")
