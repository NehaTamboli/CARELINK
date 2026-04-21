import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6ca6d710/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all messages
app.get("/make-server-6ca6d710/messages", async (c) => {
  try {
    const messages = await kv.getByPrefix("message:");
    return c.json({ success: true, messages: messages || [] });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single message by ID
app.get("/make-server-6ca6d710/messages/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const message = await kv.get(`message:${id}`);
    
    if (!message) {
      return c.json({ success: false, error: "Message not found" }, 404);
    }
    
    return c.json({ success: true, message });
  } catch (error) {
    console.error("Error fetching message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new message
app.post("/make-server-6ca6d710/messages", async (c) => {
  try {
    const body = await c.req.json();
    const { message, sender, category, urgency, status, contact, amount, location } = body;
    
    // Generate unique ID
    const id = Date.now().toString();
    
    const messageData = {
      id,
      message,
      sender: sender || "Anonymous",
      category: category || "General",
      urgency: urgency || "Medium",
      status: status || "pending",
      contact: contact || "",
      amount: amount || null,
      location: location || "",
      timestamp: new Date().toISOString(),
    };
    
    await kv.set(`message:${id}`, messageData);
    
    return c.json({ success: true, message: messageData });
  } catch (error) {
    console.error("Error creating message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update message status
app.put("/make-server-6ca6d710/messages/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existingMessage = await kv.get(`message:${id}`);
    
    if (!existingMessage) {
      return c.json({ success: false, error: "Message not found" }, 404);
    }
    
    const updatedMessage = {
      ...existingMessage,
      ...body,
    };
    
    await kv.set(`message:${id}`, updatedMessage);
    
    return c.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete message
app.delete("/make-server-6ca6d710/messages/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`message:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Analyze message endpoint (AI classification simulation)
app.post("/make-server-6ca6d710/analyze", async (c) => {
  try {
    const body = await c.req.json();
    const { message } = body;
    
    // Simple keyword-based classification
    const lowerMessage = message.toLowerCase();
    
    let category = "General";
    let urgency = "Medium";
    let extractedInfo: any = {};
    
    // Category detection
    if (lowerMessage.includes("donat") || lowerMessage.includes("contribut") || lowerMessage.includes("₹") || lowerMessage.includes("rs")) {
      category = "Donation";
      // Extract amount - improved regex to capture full numbers
      const amountMatch = message.match(/₹\s*(\d+(?:,\d+)*)|rs\.?\s*(\d+(?:,\d+)*)|(\d+(?:,\d+)*)\s*(?:rupees|rs)/i);
      if (amountMatch) {
        // Get the matched group (could be in different positions depending on pattern)
        const amount = amountMatch[1] || amountMatch[2] || amountMatch[3];
        // Remove commas for storage but keep the original format
        extractedInfo.amount = amount.replace(/,/g, '');
      }
    } else if (lowerMessage.includes("volunteer") || lowerMessage.includes("help") || lowerMessage.includes("join")) {
      category = "Volunteer";
    } else if (lowerMessage.includes("complaint") || lowerMessage.includes("issue") || lowerMessage.includes("problem")) {
      category = "Complaint";
      urgency = "High";
    } else if (lowerMessage.includes("partner") || lowerMessage.includes("collaborat") || lowerMessage.includes("partnership")) {
      category = "Partnership";
    }
    
    // Urgency detection
    if (lowerMessage.includes("urgent") || lowerMessage.includes("immediately") || lowerMessage.includes("asap")) {
      urgency = "Critical";
    } else if (lowerMessage.includes("soon") || lowerMessage.includes("important")) {
      urgency = "High";
    }
    
    // Extract contact info
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = message.match(/\+?\d[\d\s-]{8,}/);
    
    if (emailMatch) {
      extractedInfo.email = emailMatch[0];
    }
    if (phoneMatch) {
      extractedInfo.phone = phoneMatch[0];
    }
    
    // Extract name (simple heuristic)
    const nameMatch = message.match(/(?:name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (nameMatch) {
      extractedInfo.name = nameMatch[1];
    }
    
    return c.json({
      success: true,
      analysis: {
        category,
        urgency,
        extractedInfo,
        confidence: 0.85,
      },
    });
  } catch (error) {
    console.error("Error analyzing message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);