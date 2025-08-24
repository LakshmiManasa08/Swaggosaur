
import requests

API_KEY = "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"  # Replace with your actual OpenRouter API key
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def ask_openrouter(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "meta-llama/llama-3.2-3b-instruct:free",  # Note the correct model identifier format
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512 
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        data = response.json()

        if 'choices' in data:
            return data['choices'][0]['message']['content']
        elif 'error' in data:
            print("API Error:", data['error']['message'])
            return None
        else:
            print("Unexpected response:", data)
            return None

    except requests.exceptions.RequestException as e:
        print("Request failed:", e)
        return None

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    reply = ask_openrouter(user_prompt)
    if reply:
        print("\nModel response:\n", reply)
    else:
        print("Failed to get a response from the model.")
