import { useState, useEffect } from 'react';
import './adminFAQ.css';

function FAQForm({ faq, onSave, onCancel }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // If editing, fill in the form
  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    }
  }, [faq]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ question, answer });
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="faq-form-overlay">
      <div className="faq-form">
        <h3>{faq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question..."
              required
            />
          </div>

          <div className="form-group">
            <label>Answer:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer..."
              rows="6"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save">
              {faq ? 'Update' : 'Add'} FAQ
            </button>
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FAQForm;