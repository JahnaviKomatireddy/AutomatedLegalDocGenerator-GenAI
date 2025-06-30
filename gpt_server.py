import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt4all import GPT4All

app = Flask(__name__)
CORS(app)

print("🔄 Loading model...")
model_path = "C:/Users/jayan/gpt4all/models/mistral.Q4_0.gguf"

try:
    model = GPT4All(model_path, model_type="mistral")
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Failed to load model:", e)
    model = None

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json
        question = data.get("question")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        if not model:
            return jsonify({"error": "Model not loaded"}), 500

        print(f"🔁 Generating response for: {question}")

        # Set threads globally in config
        model.config['threads'] = 6
        prompt = f"You are a highly knowledgeable and detailed AI support assistant. Always provide in-depth, well-structured responses with examples, especially for technical questions. When explaining concepts like Java OOPS, cover all major pillars: Encapsulation, Inheritance, Polymorphism, Abstraction, and include code examples. {question}\nAssistant:"
        response = model.generate(
            prompt,
            max_tokens=256,
            temp=0.7
        )

        print("Response generated")
        return jsonify({"response": response})

    except Exception as e:
        print(" Error in /ask route:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000)