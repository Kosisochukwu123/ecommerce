import express from "express";
import faqController from "../controllers/faq.controller.js";

const router = express.Router();

// GET /api/admin/faqs
router.get("/", faqController.getAdminFAQs);

// Create FAQ
router.post("/", faqController.createFAQ);

// Delete FAQ by ID
router.delete("/:id", faqController.deleteFAQ);

// Update FAQ by ID
router.put("/:id", faqController.updateFAQ);

export default router;
