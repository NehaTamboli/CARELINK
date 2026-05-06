import { projectId, publicAnonKey } from '/utils/supabase/info';

// Backend Python API URL - for AI analysis
const BACKEND_API_URL = "http://65.2.33.200:8000/api";
// Supabase API URL - for message storage
const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6ca6d710`;

interface Message {
  id: string;
  message: string;
  sender: string;
  category: string;
  urgency: string;
  status: string;
  contact: string;
  amount: string | null;
  location: string;
  timestamp: string;
}

export const api = {
  // Get all messages
  async getMessages(): Promise<Message[]> {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching messages:', data.error);
        return [];
      }
      
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Create a new message
  async createMessage(messageData: {
    message: string;
    sender?: string;
    category?: string;
    urgency?: string;
    status?: string;
    contact?: string;
    amount?: string | null;
    location?: string;
  }): Promise<Message | null> {
    try {
      const response = await fetch(`${API_URL}/messages` , {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error creating message:', data.error);
        return null;
      }
      
      return data.message;
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  },

  // Update message
  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | null> {
    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error updating message:', data.error);
        return null;
      }
      
      return data.message;
    } catch (error) {
      console.error('Error updating message:', error);
      return null;
    }
  },

  // Delete message
  async deleteMessage(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  },

  // Analyze message with AI using Python backend
  async analyzeMessage(message: string): Promise<any> {
    try {
      // Call Python FastAPI backend for AI analysis
      const response = await fetch(`${BACKEND_API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        return data.analysis;
      }

      console.error('Backend analysis failed:', data);
      return null;
    } catch (error) {
      console.error('Error connecting to Python backend:', error);
      console.log('Make sure backend is running: python backend/main.py');
      return null;
    }
  },

  // Get quiz questions from Python backend
  async getQuizQuestions(): Promise<any[]> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/quiz/questions`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data.success ? data.questions : [];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  },

  // Chat with AI bot
  async chatWithBot(message: string, context?: string): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      const data = await response.json();
      return data.success ? data.response : 'Sorry, I am unable to respond at the moment.';
    } catch (error) {
      console.error('Error chatting with bot:', error);
      return 'Sorry, I am unable to connect to the backend server. Please ensure the Python backend is running.';
    }
  },
};
