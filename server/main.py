from PIL import Image
import pytesseract
import re, json

from dotenv import load_dotenv
import google.generativeai as genai
from os import getenv

load_dotenv()
genai.configure(api_key=getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

prompt_img = './dynamic/prompt.jpg'

img = Image.open(prompt_img)
# Use Tesseract to extract text
extracted_text = pytesseract.image_to_string(img)
# print('debug', extracted_text)
# print(extracted_text)

# Extract the Aadhar number (12 digits) using regular expressions
aadhar_number = re.findall(r'\b\d{4}\s\d{4}\s\d{4}\b', extracted_text)

dob = re.findall(r'\b(?:0[1-9]|[12][0-9]|3[01])/(?:0[1-9]|1[0-2])/\d{4}\b', extracted_text)

def get_name():
    myfile = genai.upload_file(prompt_img)
    # print(f"{myfile=}")
    extract_name_prompt = "Extract the name, be careful to avoid names of family members like son, daughter, father, mother, wife, etc. Reply with only the name of the person and nothing else. If you can't find the name reply \"not found\""

    response = model.generate_content(
        [myfile, extract_name_prompt]
    )

    return response.candidates[0].content.parts[0].text


name = get_name()

print(f"Name: {name}")
print(f"Aadhar Number: {aadhar_number[0] if aadhar_number else 'Not found'}")
print(f"DOB: {dob[-1] if dob else 'Not Found'}")

data = {
    'aadhar_number': aadhar_number if aadhar_number else None,
    'dob': dob if dob else None,
    'name': name
}

with open('./dynamic/detected.json', 'w') as f:
    json.dump(data, f, indent=4)
