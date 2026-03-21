from openai import OpenAI
client = OpenAI()

def extract_skills(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Extract skills: {text}"}]
    )

    content = response.choices[0].message.content

    import json
    try:
        return json.loads(content)
    except:
        return []