import { useState, useEffect } from "react";
import faqService from "../../services/faqService"; // 📞 Import the phone
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]); // 📦 Empty box at first
  const [loading, setLoading] = useState(true); // ⏳ Loading spinner

  // 🎬 When page loads, call the backend
  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    const faqs = await faqService.getFAQs(); // 📞 Make the call
    setFaqData(faqs); // 📦 Fill the box with FAQs
    setLoading(false);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <div className="faq-container">Loading FAQs...</div>;
  }

  return (
    <div className="faq-container">
      
      <h2 className="faq-title" data-aos="fade-up-right">
        Frequently Asked Questions
      </h2>

      <div>
        {faqData.map((item, index) => (
          <div className="faq-item" key={item.id} data-aos="fade-up-left">
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {item.question}
              <span className={`arrow ${openIndex === index ? "open" : ""}`}>
                ▼
              </span>
            </button>

            <div className={`faq-answer ${openIndex === index ? "show" : ""}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
