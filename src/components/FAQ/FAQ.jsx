import { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 3–5 business days depending on your location.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return any item within 14 days of purchase as long as it is unused and in original packaging.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking link via email.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! Our support team is available 24/7 through email and live chat.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div>
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
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
