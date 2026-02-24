import { useState, useEffect } from 'react';
import faqService from '../../../../services/faqService';
import FAQForm from './FAQForm';
// import './admin.css';

function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const data = await faqService.getAdminFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      alert('Failed to load FAQs');
    }
    setLoading(false);
  };

  const handleSaveFAQ = async (faqData) => {
    try {
      if (editingFAQ) {
        // Update existing FAQ
        await faqService.updateFAQ(editingFAQ.id, faqData);
      } else {
        // Create new FAQ
        await faqService.createFAQ(faqData);
      }
      
      loadFAQs(); // Refresh the list
      setShowForm(false);
      setEditingFAQ(null);
    } catch (error) {
      console.error('Failed to save FAQ:', error);
      alert('Failed to save FAQ');
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        loadFAQs();
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
        alert('Failed to delete FAQ');
      }
    }
  };

  const handleToggleActive = async (faq) => {
    try {
      await faqService.updateFAQ(faq.id, {
        ...faq,
        isActive: !faq.isActive
      });
      loadFAQs();
    } catch (error) {
      console.error('Failed to toggle FAQ:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-faq">
      <div className="page-header">
        <h1>Manage FAQs</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New FAQ
        </button>
      </div>

      {showForm && (
        <FAQForm
          faq={editingFAQ}
          onSave={handleSaveFAQ}
          onCancel={() => {
            setShowForm(false);
            setEditingFAQ(null);
          }}
        />
      )}

      <div className="faq-admin-list">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="faq-admin-item">
            <div className="faq-admin-content">
              <span className="faq-order">#{index + 1}</span>
              <div className="faq-text">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
              <div className="faq-status">
                <span className={faq.isActive ? 'active' : 'inactive'}>
                  {faq.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
            </div>
            
            <div className="faq-admin-actions">
              <button
                onClick={() => {
                  setEditingFAQ(faq);
                  setShowForm(true);
                }}
                className="btn-edit"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleToggleActive(faq)}
                className="btn-toggle"
              >
                {faq.isActive ? '👁️ Hide' : '👁️ Show'}
              </button>
              <button
                onClick={() => handleDeleteFAQ(faq.id)}
                className="btn-delete"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFAQ;