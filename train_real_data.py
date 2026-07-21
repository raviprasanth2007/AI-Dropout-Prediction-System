import requests

url = 'http://localhost:8000/upload-dataset'
files = {'file': open('d:/AI Dropout Prediction System/students_dataset.csv', 'rb')}
response = requests.post(url, files=files)

print("Status:", response.status_code)
print("Response:", response.json())
