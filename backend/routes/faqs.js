import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

// In-memory storage for FAQs (you can move to MongoDB later)
let faqs = [
  {
    id: "1",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all unused items with original tags. Simply contact our customer support to initiate a return.",
    isActive: true,
    order: 1
  },
  {
    id: "2",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout for an additional fee.",
    isActive: true,
    order: 2
  },
  {
    id: "3",
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.",
    isActive: true,
    order: 3
  },
  {
    id: "4",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in the 'My Orders' section of your account.",
    isActive: true,
    order: 4
  },
  {
    id: "5",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, AmEx), PayPal, and Apple Pay for a secure checkout experience.",
    isActive: true,
    order: 5
  }
];

// @route   GET /api/faqs/public
// @desc    Get active FAQs for visitors (PUBLIC)
// @access  Public
router.get("/public", (req, res) => {
  console.log("📋 GET /api/faqs/public called");
  
  // Only return active FAQs, sorted by order
  const activeFaqs = faqs
    .filter(faq => faq.isActive)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    faqs: activeFaqs,
    count: activeFaqs.length
  });
});

// @route   GET /api/faqs
// @desc    Get all FAQs (ADMIN)
// @access  Private/Admin
router.get("/", protect, (req, res) => {
  console.log("📋 GET /api/faqs called by:", req.user.email);

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  // Return all FAQs (including inactive)
  const sortedFaqs = faqs.sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    faqs: sortedFaqs,
    count: sortedFaqs.length
  });
});

// @route   POST /api/faqs
// @desc    Create new FAQ (ADMIN)
// @access  Private/Admin
router.post("/", protect, (req, res) => {
  console.log("📝 POST /api/faqs called by:", req.user.email);

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  const { question, answer, isActive } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      message: "Question and answer are required"
    });
  }

  // Create new FAQ
  const newFaq = {
    id: Date.now().toString(),
    question,
    answer,
    isActive: isActive !== undefined ? isActive : true,
    order: faqs.length + 1
  };

  faqs.push(newFaq);

  console.log("✅ FAQ created:", newFaq);

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    faq: newFaq
  });
});

// @route   PUT /api/faqs/:id
// @desc    Update FAQ (ADMIN)
// @access  Private/Admin
router.put("/:id", protect, (req, res) => {
  console.log("📝 PUT /api/faqs/:id called by:", req.user.email);

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  const { id } = req.params;
  const { question, answer, isActive } = req.body;

  const faqIndex = faqs.findIndex(faq => faq.id === id);

  if (faqIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "FAQ not found"
    });
  }

  // Update FAQ
  if (question !== undefined) faqs[faqIndex].question = question;
  if (answer !== undefined) faqs[faqIndex].answer = answer;
  if (isActive !== undefined) faqs[faqIndex].isActive = isActive;

  console.log("✅ FAQ updated:", faqs[faqIndex]);

  res.json({
    success: true,
    message: "FAQ updated successfully",
    faq: faqs[faqIndex]
  });
});

// @route   DELETE /api/faqs/:id
// @desc    Delete FAQ (ADMIN)
// @access  Private/Admin
router.delete("/:id", protect, (req, res) => {
  console.log("🗑️ DELETE /api/faqs/:id called by:", req.user.email);

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  const { id } = req.params;
  const faqIndex = faqs.findIndex(faq => faq.id === id);

  if (faqIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "FAQ not found"
    });
  }

  const deletedFaq = faqs.splice(faqIndex, 1)[0];

  console.log("✅ FAQ deleted:", deletedFaq);

  res.json({
    success: true,
    message: "FAQ deleted successfully",
    faq: deletedFaq
  });
});

export default router;