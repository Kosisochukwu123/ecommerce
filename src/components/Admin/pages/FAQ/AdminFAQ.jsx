import { useState, useEffect } from 'react';
import faqService from '../../../../services/faqService';
import FAQForm from './FAQForm';
import ContactSettings from '../../ContactSettings/ContactSettings';
import './adminFAQ.css';

function AdminFAQ() {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' or 'contact'
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'faqs') {
      loadFAQs();
    }
  }, [activeTab]);

  const loadFAQs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await faqService.getAdminFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      setError(`Failed to load FAQs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFAQ = async (faqData) => {
    try {
      if (editingFAQ) {
        await faqService.updateFAQ(editingFAQ.id, faqData);
      } else {
        await faqService.createFAQ(faqData);
      }
      
      loadFAQs();
      setShowForm(false);
      setEditingFAQ(null);
    } catch (error) {
      console.error('Failed to save FAQ:', error);
      alert(`Failed to save FAQ: ${error.message}`);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        loadFAQs();
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
        alert(`Failed to delete FAQ: ${error.message}`);
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

  return (
    <div className="admin-faq">
      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          📋 FAQs
        </button>
        <button
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          📞 Contact Settings
        </button>
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <>
          <div className="page-header">
            <h1>Manage FAQs</h1>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Add New FAQ
            </button>
          </div>

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

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

          {loading ? (
            <div className="loading-state">Loading FAQs...</div>
          ) : (
            <div className="faq-admin-list">
              {faqs.length === 0 ? (
                <div className="empty-state">
                  <p>No FAQs found. Click "Add New FAQ" to get started.</p>
                </div>
              ) : (
                faqs.map((faq, index) => (
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
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Contact Settings Tab */}
      {activeTab === 'contact' && <ContactSettings />}
    </div>
  );
}

export default AdminFAQ;