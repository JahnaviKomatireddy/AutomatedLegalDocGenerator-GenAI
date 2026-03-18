from flask import Flask, request, jsonify, send_file
from gpt4all import GPT4All
from io import BytesIO
from reportlab.lib.pagesizes import LETTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch
import re
app = Flask(__name__)
MODEL_PATH = "C:/Users/jayan/gpt4all/models/mistral.Q4_0.gguf"
print(" Loading GPT4All model...")
model = GPT4All(MODEL_PATH, model_type="mistral", allow_download=False)
print(" Model loaded successfully.")
DEFAULT_VALUES = {
    "PartyA": "Disclosing Company Inc.",
    "PartyB": "Receiving Party LLC",
    "EffectiveDate": "October 16, 2025",
    "GoverningLaw": "California",
    "AddressA": "456 Elm St, Anytown, CA",
    "AddressB": "789 Oak St, Anytown, CA"
}
# Mapping document type to signature roles
DOC_SIGNATURES = {
    "NDA Agreement": ("Disclosing Party", "Recipient Party"),
    "Employment Contract": ("Employer Name", "Employee Name"),
    "Lease Agreement": ("Landlord Name", "Tenant Name"),
    "Power of Attorney": ("Principal Name", "Agent Name"),
    "Service Agreement": ("Service Provider", "Client Name"),
}
def clean_text(text: str) -> str:
    text = re.sub(r"(?i)you are an ai.*", "", text)
    text = text.replace("Ð", "")
    text = text.replace("\r", "")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"<.*?>", "", text)
    return text.strip()
def text_to_pdf(title: str, text: str, partyA_name: str, partyB_name: str) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=LETTER,
        topMargin=70, bottomMargin=50, leftMargin=60, rightMargin=60
    )
    styles = getSampleStyleSheet()
    # Use Times-Roman font for legal/professional look
    title_style = ParagraphStyle(
        "TitleStyle", parent=styles["Title"], fontName="Times-Roman",
        fontSize=22, alignment=TA_CENTER, textColor=colors.HexColor("#000000"),
        spaceAfter=24
    )
    section_style = ParagraphStyle(
        "SectionStyle", parent=styles["Heading2"], fontName="Times-Roman",
        fontSize=14, textColor=colors.HexColor("#000000"),
        spaceBefore=12, spaceAfter=6
    )
    body_style = ParagraphStyle(
        "BodyStyle", parent=styles["Normal"], fontName="Times-Roman",
        alignment=TA_JUSTIFY, fontSize=11, leading=16
    )
    elements = [Paragraph(title.upper(), title_style), Spacer(1, 12)]
    lines = text.split("\n")
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if re.match(r"^(Introduction|Definitions|Terms|Obligations|Governing|Signatures)", line, re.IGNORECASE):
            elements.append(Paragraph(line, section_style))
        else:
            elements.append(Paragraph(line, body_style))
        elements.append(Spacer(1, 8))

    # Add signature block
    elements.append(Spacer(1, 25))
    elements.append(Paragraph(
        "IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.",
        body_style
    ))
    elements.append(Spacer(1, 40))

    signature_data = [
        [f"By: {partyA_name}", "", f"By: {partyB_name}", ""],
        ["________________________", "", "________________________", ""],
        ["Title: Authorized Representative", "", "Title: Authorized Representative", ""],
    ]
    table = Table(signature_data, colWidths=[2.5 * inch, 0.5 * inch, 2.5 * inch, 0.5 * inch])
    table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return buffer
@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        doc_type = data.get("docType", "Legal Document")
        fields = data.get("fields", {})
        all_fields = {**DEFAULT_VALUES, **fields}

        prompt = f"""
You are a legal expert AI. Generate a concise and professional {doc_type} in clear legal English.
Use these provided details: {all_fields}.
Your response must include exactly the following 5 sections:
1. Introduction
2. Definitions
3. Terms & Obligations
4. Governing Law
5. Signatures
Guidelines:
- Use given names and data exactly as provided (no placeholders).
- Keep the document under 500 words.
- Write formal, natural, human-like legal text.
- Exclude disclaimers, instructions, or markdown formatting.
"""
        print(" Generating document for:", doc_type)
        with model.chat_session():
            response = model.generate(prompt, max_tokens=800, temp=0.5, streaming=False)
        final_text = clean_text(response)
        if not final_text:
            raise ValueError("AI returned empty content.")
        # Determine signature names dynamically
        partyA_field, partyB_field = DOC_SIGNATURES.get(doc_type, ("PartyA", "PartyB"))
        partyA_name = all_fields.get(partyA_field, DEFAULT_VALUES["PartyA"])
        partyB_name = all_fields.get(partyB_field, DEFAULT_VALUES["PartyB"])

        print(" AI text ready, building PDF...")
        pdf_file = text_to_pdf(doc_type, final_text, partyA_name, partyB_name)
        return send_file(
            pdf_file,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"{doc_type.replace(' ', '_')}.pdf"
        )
    except Exception as e:
        print(" Error generating document:", e)
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000)



