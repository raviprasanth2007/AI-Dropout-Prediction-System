from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
from generator import generate_synthetic_data
from model import model_service

app = FastAPI(title="AI Dropout Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    student_data: dict

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model_service.model is not None}

@app.post("/generate-and-train")
def generate_and_train(num_records: int = 1000):
    try:
        # Generate synthetic data
        print(f"Generating {num_records} synthetic records...")
        df = generate_synthetic_data(num_records)
        
        # Train model
        results = model_service.train(df)
        
        return {
            "message": "Data generated and model trained successfully (Mode 1)",
            "records_generated": len(df),
            "training_results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
            
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        if 'dropout' not in [col.lower() for col in df.columns]:
            raise HTTPException(status_code=400, detail="CSV must contain a 'dropout' column.")
            
        # Ensure column names are standardized
        df.columns = [col.strip() for col in df.columns]
        
        results = model_service.train(df)
        
        return {
            "message": "Dataset uploaded and model retrained successfully (Mode 2)",
            "records_processed": len(df),
            "training_results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        model_service._load_if_exists()  # Force reload from disk to prevent old pickle caching
        result = model_service.predict(request.student_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
