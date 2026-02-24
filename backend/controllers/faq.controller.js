import fs from "fs";
import path from "path";
// const path = require("path");
import { fileURLToPath } from "url";

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Where the toy box is located
const FAQ_FILE = path.join(__dirname, "../data/faqs.json");

// Helper: Read the toy box
function readFAQs() {
  try {
    if (!fs.existsSync(FAQ_FILE)) {
      return [];
    }

    const data = fs.readFileSync(FAQ_FILE, "utf8");

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading FAQs:", error);
    return [];
  }
}


// Helper: Save to the toy box
function saveFAQs(faqs) {
  fs.writeFileSync(FAQ_FILE, JSON.stringify(faqs, null, 2));
}

class FAQController {
  // 📖 Get all FAQs (for visitors)
  getAllFAQs(req, res) {
    try {
      const faqs = readFAQs();
      // Only show active FAQs, sorted by order
      const activeFAQs = faqs
        .filter((faq) => faq.isActive)
        .sort((a, b) => a.order - b.order);

      res.json({ success: true, faqs: activeFAQs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Failed to load FAQs" });
    }
  }

  // 🎮 Get all FAQs (for admin - includes inactive ones)
  getAdminFAQs(req, res) {
    try {
      const faqs = readFAQs();
      res.json({ success: true, faqs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Failed to load FAQs" });
    }
  }

  // ➕ Add a new FAQ
  createFAQ(req, res) {
    try {
      const faqs = readFAQs();
      const { question, answer } = req.body;

      // Create new FAQ with a unique ID
      const newFAQ = {
        id: Date.now().toString(), // Simple ID (like a serial number)
        question,
        answer,
        order: faqs.length + 1, // Put it at the end
        isActive: true,
      };

      faqs.push(newFAQ);
      saveFAQs(faqs);

      res.json({ success: true, faq: newFAQ });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Failed to create FAQ" });
    }
  }

  // ✏️ Update an FAQ
  updateFAQ(req, res) {
    try {
      const faqs = readFAQs();
      const { id } = req.params;
      const { question, answer, order, isActive } = req.body;

      // Find the FAQ to update
      const index = faqs.findIndex((faq) => faq.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: "FAQ not found" });
      }

      // Update it
      faqs[index] = {
        ...faqs[index],
        question: question || faqs[index].question,
        answer: answer || faqs[index].answer,
        order: order !== undefined ? order : faqs[index].order,
        isActive: isActive !== undefined ? isActive : faqs[index].isActive,
      };

      saveFAQs(faqs);
      res.json({ success: true, faq: faqs[index] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Failed to update FAQ" });
    }
  }

  // 🗑️ Delete an FAQ
  deleteFAQ(req, res) {
    try {
      const faqs = readFAQs();
      const { id } = req.params;

      const filteredFAQs = faqs.filter((faq) => faq.id !== id);

      if (filteredFAQs.length === faqs.length) {
        return res.status(404).json({ success: false, error: "FAQ not found" });
      }

      saveFAQs(filteredFAQs);
      res.json({ success: true, message: "FAQ deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete FAQ" });
    }
  }
}

export default new FAQController();
