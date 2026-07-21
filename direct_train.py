import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai-service'))

from generator import generate_synthetic_data
from model import model_service

print("Initiating Enterprise Data Generation (10,000 Records)...")
df = generate_synthetic_data(10000)
print(f"Generated dataset with {len(df)} records. Starting Training Pipeline...")

results = model_service.train(df)

print("Training Complete. Model Metadata logged to PostgreSQL.")
print("Best Model:", results['best_model'])
print("Metrics:", results['metrics'])
