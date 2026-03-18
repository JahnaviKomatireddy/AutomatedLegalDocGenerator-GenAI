import { useState, useEffect, useRef } from "react";
import axios from "axios";
const cardImages = {
  nda: '/nda-card.png', 
  employment: '/employment-card.png', 
  lease: '/lease-card.png', 
  powerOfAttorney: '/poa-card.png', 
  service: '/service-card.png', 
};
const mainBackground = '/bg-legal.png'; 
const legalDocs = [
  {
    id: 1,
    title: "NDA Agreement",
    shortDescription: "Protects confidential information and trade secrets.",
    description: "A Non-Disclosure Agreement (NDA) is a critical legal contract used to safeguard sensitive information. It creates a confidential relationship between parties, ensuring that proprietary knowledge, business strategies, client lists, or innovative ideas are not shared with unauthorized individuals. NDAs are essential in business negotiations, during hiring processes for key roles, and when collaborating with external partners or contractors. They provide legal recourse in case of a breach, reinforcing trust and protecting intellectual property.",
    fields: ["Recipient party", "Disclosing Party", "Date(DD-MM-YYYY)"],
    image: cardImages.nda,
  },
  {
    id: 2,
    title: "Employment Contract",
    shortDescription: "Defines the terms and conditions of employment.",
    description: "An Employment Contract is a foundational document that formalizes the relationship between an employer and an employee. It clearly outlines the rights, responsibilities, and obligations of both parties. Key elements typically include job duties, compensation (salary, benefits), working hours, terms of employment (e.g., permanent, fixed-term), confidentiality clauses, and conditions for termination. This contract provides clarity, prevents disputes, and ensures legal compliance for a stable working environment.",
    fields: ["Employee Name", "Employer Name", "Start Date(DD-MM-YYYY)", "Salary"],
    image: cardImages.employment,
  },
  {
    id: 3,
    title: "Lease Agreement",
    shortDescription: "Contract for rental of property.",
    description: "A Lease Agreement is a legally binding contract between a landlord and a tenant for the rental of property. It details crucial aspects such as the duration of the lease, the monthly rent amount, security deposit terms, responsibilities for maintenance and repairs, and specific rules or restrictions (e.g., pets, subletting). This document protects both parties by setting clear expectations and providing a framework for resolving potential disagreements throughout the tenancy period.",
    fields: ["Tenant Name", "Landlord Name", "Property Address", "Lease Start Date(DD-MM-YYYY)"],
    image: cardImages.lease,
  },
  {
    id: 4,
    title: "Power of Attorney",
    shortDescription: "Authorizes someone to act on your behalf.",
    description: "A Power of Attorney (POA) is a legal instrument that grants one individual (the agent or attorney-in-fact) the authority to make decisions and act on behalf of another person (the principal). This can cover financial, medical, or legal matters. POAs are invaluable for situations where the principal might be unavailable or incapacitated, ensuring that their affairs can still be managed according to their wishes. It's a powerful tool for personal and estate planning.",
    fields: ["Principal Name", "Agent Name", "Effective Date(DD-MM-YYYY)"],
    image: cardImages.powerOfAttorney,
  },
  {
    id: 5,
    title: "Service Agreement",
    shortDescription: "Outlines terms for services provided.",
    description: "A Service Agreement is a contract between a service provider and a client that specifies the terms under which services will be rendered. It meticulously defines the scope of work, deliverables, payment schedules, intellectual property rights, and confidentiality obligations. This agreement is crucial for freelancers, consultants, and businesses offering services, as it ensures both parties are aligned on expectations, protects against scope creep, and provides a clear framework for the professional relationship.",
    fields: ["Client Name", "Service Provider", "Service Description", "Start Date(DD-MM-YYYY)"],
    image: cardImages.service,
  }
];
export default function LegalDocs() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [visibleCards, setVisibleCards] = useState({});
  const cardRefs = useRef([]); 
  useEffect(() => {
    if (selectedDoc) return; 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId;
            setTimeout(() => {
              setVisibleCards((prev) => ({ ...prev, [cardId]: true }));
            }, parseInt(entry.target.dataset.delay || "0", 10)); 
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the card is visible
      }
    );
    if (!selectedDoc) {
        cardRefs.current.forEach((cardRef) => {
          if (cardRef) observer.observe(cardRef);
        });
    }
    return () => {
      cardRefs.current.forEach((cardRef) => {
        if (cardRef) observer.unobserve(cardRef);
      });
    };
  }, [selectedDoc]); 
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleGenerate = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
        const res = await axios.post(
            "/api/generate-doc",
            { docType: selectedDoc.title, fields: formData },
            { responseType: "blob" }
        );
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
    } catch (err) {
        console.error(err);
        alert("Failed to generate document");
    } finally {
        setLoading(false);
    }
  };return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: `url(${mainBackground})`, 
               backgroundColor: '#1a1a1a' }} 
    >
      {/* 4. HERO SECTION: Full Height, NO Black Overlay on the main container. */}
      <div className="relative h-screen flex items-center justify-center p-8"> 
         <div 
                  className="relative text-center max-w-5xl z-10 
                             p-10 rounded-2xl shadow-2xl border border-white border-opacity-30 
                             backdrop-filter backdrop-blur-md text-white" 
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} // <-- CUSTOM RGBA for soft transparency
                > 
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeInDown drop-shadow-lg text-white">
            Your Comprehensive Legal Document Generation Platform
          </h1>
          <p className="text-xl md:text-2xl font-light mb-10 opacity-90 animate-fadeInUp drop-shadow-md text-gray-200">
            In today's complex world, navigating legal requirements can be daunting. Our platform simplifies this by providing instant, customizable generation of essential legal documents. From safeguarding your innovations with an NDA to formalizing employment terms, protecting property rights with a Lease Agreement, or empowering trusted individuals with a Power of Attorney, we cover your critical needs. These documents are vital tools for clarity, protection, and peace of mind in both personal and business dealings, ensuring your agreements are sound and legally compliant.
          </p>
          <a href="#document-cards" className="inline-block px-10 py-4 text-xl font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 text-white">
            Explore Document Types Below ↓
          </a>
        </div>
      </div>
      {/* End Hero Section */}
      <main className="p-8 md:p-16 relative z-10">
        {/* Scroll Anchor */}
        <div id="document-cards" className="pt-16 pb-20"> 
          <h2 className="text-4xl font-bold text-white text-center mb-16 drop-shadow-lg">
            Choose Your Essential Legal Document
          </h2>
          {/* 5. CARDS SECTION: Transparent, Side-by-Side, Scroll-Animated */}
          {!selectedDoc && (
            <div className="grid grid-cols-1 gap-12 max-w-7xl mx-auto">
              {legalDocs.map((doc, index) => (
                <div
                  key={doc.id}
                  ref={(el) => (cardRefs.current[index] = el)} 
                  data-card-id={doc.id}
                  data-delay={index * 200} // Staggered delay for scroll effect
                  className={`bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm p-8 rounded-xl shadow-2xl transition-all duration-700 ease-out 
                              ${visibleCards[doc.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} 
                              transform hover:shadow-3xl hover:-translate-y-2 border border-gray-700 hover:border-blue-500`}
                >
                  {/* Card Content Layout: Image/Title on Left, Description/Button on Right */}
                  <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">                   
                    {/* LEFT SIDE: Image and Title */}
                    <div className="flex flex-col items-center md:items-start flex-shrink-0 w-full md:w-1/3 p-4 bg-black bg-opacity-20 rounded-lg">
                        <h3 className="text-3xl font-bold mb-4 text-blue-300 text-center md:text-left">{doc.title}</h3>
                        <img 
                            src={doc.image} 
                            alt={doc.title} 
                            className="w-full h-48 object-cover rounded-lg shadow-xl border-2 border-gray-400" 
                        />
                    </div>                   
                    {/* RIGHT SIDE: Long Description and Button */}
                    <div className="flex-grow text-white text-center md:text-left p-2">
                        <h4 className="text-2xl font-semibold mb-3 text-blue-200">Importance & Use:</h4>
                        <p className="text-lg font-light mb-6 opacity-90 leading-relaxed text-gray-200">
                            {doc.description}
                        </p>
                        <button
                            onClick={() => {
                                setSelectedDoc(doc);
                                setFormData({});
                                setPdfUrl(null);
                            }}
                            className="w-full md:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                        >
                            Generate Document
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 6. FORM SECTION: When a document is selected */}
        {selectedDoc && (
          <div className="max-w-3xl mx-auto bg-white bg-opacity-95 p-8 md:p-10 rounded-xl shadow-2xl border-t-4 border-blue-600 mt-10 animate-fadeInUp">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <img src={selectedDoc.image} alt={selectedDoc.title} className="w-12 h-12 object-cover rounded-md mr-3 border-2 border-blue-400" />
              {selectedDoc.title} Details
              </h3>
              <p className="mb-6 text-gray-700 border-b pb-4 text-lg">
              {selectedDoc.description}
              </p>
              <div className="space-y-6">
              {selectedDoc.fields.map((field) => (
                  <div key={field}>
                  <label className="block font-semibold text-gray-700 mb-2 text-lg">{field}</label>
                  <input
                      type="text"
                      value={formData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 transition duration-150 bg-gray-50"
                      placeholder={`Enter ${field}`}
                  />
                  </div>
              ))}
              </div>
              <div className="mt-8 flex gap-4 flex-wrap">
              <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition duration-300 shadow-md flex items-center justify-center min-w-[150px]"
              >
                  {loading ? (
                  <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                  </>
                  ) : (
                  "Generate Document"
                  )}
              </button>
              <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-3 text-lg font-semibold bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 min-w-[150px]"
              >
                  ← Back to Selection
              </button>
              </div>
              {pdfUrl && (
              <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Document Options:</h3>
                  <div className="flex flex-wrap gap-4">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                       className="inline-block px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                      Open PDF in New Tab
                    </a>
                    <a href={pdfUrl} download={`${selectedDoc.title}.pdf`}
                       className="inline-block px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-md">
                      Download PDF
                    </a>
                  </div>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}