# 📄 Automated Legal Document Generator using Generative AI

An AI-powered web application that generates professional legal documents instantly using a local Large Language Model (GPT4All). The system converts user inputs into structured legal agreements and exports them as downloadable PDF files.

---

## 🚀 Overview

This project simplifies the process of drafting legal documents by automating it using Generative AI.

Users can enter basic details, and the system generates well-structured legal documents such as NDAs, employment contracts, lease agreements, and more — within seconds.

The application uses an **offline LLM (GPT4All)**, ensuring:

* Data privacy 🔐
* No dependency on external APIs 🌐
* Cost efficiency 💰

---

## ✨ Features

* 📄 Generate multiple types of legal documents:

  * NDA Agreement
  * Employment Contract
  * Lease Agreement
  * Power of Attorney
  * Service Agreement

* 🧠 AI-powered content generation using GPT4All (Mistral model)

* 📝 Structured legal format with sections:

  * Introduction
  * Definitions
  * Terms & Obligations
  * Governing Law
  * Signatures

* 📥 Automatic PDF generation with professional formatting

* 🔐 Secure backend API integration

* ⚡ Fast and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* Next.js (React)
* Tailwind CSS
* Axios

### Backend

* Flask (Python)
* REST API

### AI / ML

* GPT4All (Local LLM - Mistral)

### PDF Generation

* ReportLab

---

## 🧠 System Architecture

User Input → Frontend (Next.js) → API Call → Flask Server → GPT4All Model → Text Processing → PDF Generation → Download

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/pulijayanth/automated-legal-document-generator-genai.git
cd automated-legal-document-generator-genai
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../server
pip install flask gpt4all reportlab
```

---

### 4. Setup GPT4All Model

Download the model and place it in:

```
C:/Users/<your-username>/gpt4all/models/
```

Example:

```
mistral.Q4_0.gguf
```

Update path in `gpt_server.py` if needed:

```python
MODEL_PATH = "C:/Users/<your-username>/gpt4all/models/mistral.Q4_0.gguf"
```

---

### 5. Run Flask Server

```bash
python gpt_server.py
```

Server runs on:

```
http://localhost:7000
```

---

### 6. Run Frontend

```bash
cd client
npm run dev
```

---

## 🧪 How It Works

1. User selects a legal document type
2. Inputs required details in the form
3. Request is sent to Flask backend
4. GPT4All generates structured legal content
5. Content is cleaned and formatted
6. PDF is generated using ReportLab
7. User downloads the document

---

## 📊 Key Highlights

* ⏱️ Reduced document drafting time by **~70%**
* 🔒 Fully offline AI system (no API usage)
* 🧠 Prompt-engineered structured legal output
* 📄 End-to-end AI → PDF pipeline

---

## 📁 Project Structure

```
ai-support-chatbot/
│
├── client/                 # Frontend (Next.js)
│   ├── pages/
│   │   └── legal-docs.js
│   ├── components/
│   ├── styles/
│   └── utils/
│
├── server/                 # Backend + AI Integration
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── gpt_server.py       # Flask LLM + PDF generator
│
└── README.md
```

---

## 📸 Screenshots

*Add screenshots here (UI, form, generated PDF preview)*

---

## 🚀 Future Enhancements

* Add more legal document templates
* Integrate RAG for better accuracy
* Add editable preview before download
* Deploy using cloud infrastructure

---

## 👨‍💻 Author

**Jayanth Puli**

* GitHub: https://github.com/pulijayanth
* LinkedIn: https://linkedin.com/in/jayanth-puli-6161ba273

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
