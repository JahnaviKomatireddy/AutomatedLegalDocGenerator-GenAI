import axios from 'axios';

export const callGPT4All = async (question) => {
  try {
    const response = await axios.post('http://127.0.0.1:7000/ask', { question });

    // ✅ Log the full response to debug
    console.log("🔥 GPT4All API response:", response.data);

    return response.data.response; // must return `response` field from Flask
  } catch (err) {
    console.error("❌ Error calling GPT4All:", err.message);
    return "Sorry, GPT4All is not available right now.";
  }
};
