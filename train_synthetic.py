import requests

print("Initiating generation of 10,000 synthetic records governed by Institutional Policy...")
url = 'http://localhost:8000/generate-and-train?num_records=10000'
response = requests.post(url)

print("Status:", response.status_code)
try:
    print("Response:", response.json())
except:
    print(response.text)
