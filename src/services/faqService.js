const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';

class FAQService {
  // 📞 Call to get FAQs for visitors
  async getFAQs() {
    try {
      const response = await fetch(`${API_URL}/faqs`);
      const data = await response.json();
      return data.faqs;
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      return [];
    }
  }

  // 📞 Call to get all FAQs for admin
  async getAdminFAQs() {
    const response = await fetch(`${API_URL}/faqs`, {
      headers: this.getAuthHeaders()
    });
    const data = await response.json();
    return data.faqs;
  }

  // 📞 Call to add new FAQ
  async createFAQ(faq) {
    const response = await fetch(`${API_URL}/faqs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(faq)
    });
    return response.json();
  }

  // 📞 Call to update FAQ
  async updateFAQ(id, faq) {
    const response = await fetch(`${API_URL}/faqs/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(faq)
    });
    return response.json();
  }

  // 📞 Call to delete FAQ
  async deleteFAQ(id) {
    const response = await fetch(`${API_URL}/faqs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // 🔑 Get admin password (token)
  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}

export default new FAQService();