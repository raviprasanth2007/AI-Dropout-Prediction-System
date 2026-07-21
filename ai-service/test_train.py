from generator import generate_synthetic_data
from model import model_service
import traceback

try:
    print("Generating synthetic data...")
    df = generate_synthetic_data(1500) # Small dataset for fast testing
    print("Training model...")
    results = model_service.train(df)
    print("Best Model:", results['best_model'])
    
    print("\nTesting prediction and SHAP generation...")
    # Get a sample row and convert to dict for predict()
    sample_data = df.iloc[0].to_dict()
    # If dropout is there, it will be dropped in predict, but predict handles it
    prediction = model_service.predict(sample_data)
    print("Prediction Risk:", prediction['riskLevel'])
    print("Top factors:", prediction['topNegativeFactors'])
    print("SHAP Generation Successful!")
except Exception as e:
    print("Error occurred:")
    traceback.print_exc()
