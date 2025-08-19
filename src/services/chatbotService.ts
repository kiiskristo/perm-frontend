import { fetchFromAPI } from './api';

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotLink {
  text: string;
  url: string;
  description: string;
}

export interface ChatbotResponse {
  response: string;
  type?: string;
  confidence?: number;
  sources?: string[];
  suggestions?: string[];
  links?: ChatbotLink[];
}

class ChatbotService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async sendMessage(message: string): Promise<ChatbotResponse> {
    if (!this.apiUrl) {
      throw new Error('API URL not configured');
    }

    const requestBody: ChatbotRequest = {
      message,
    };

    try {
      const response = await fetchFromAPI<ChatbotResponse>(
        `${this.apiUrl}/chatbot/`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );

      return response;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  }

  /**
   * Get suggested questions/prompts for the user
   */
  getSuggestedQuestions(): string[] {
    return [
      'How many certified cases for April 2024?',
      'How many pending cases for March?',
      'What is my case G-100-24036-692547?',
      'How long does processing take?',
      'Show me recent cases',
      'Help - what can you do?',
    ];
  }

  /**
   * Get the correct predictions URL that scrolls to timeline estimator
   */
  getPredictionsUrl(): string {
    return '/#timeline-estimator';
  }

  /**
   * Validate if a message looks like a case number
   */
  isCaseNumber(message: string): boolean {
    const caseNumberPattern = /G-\d+-\d{5}-\d+/i;
    return caseNumberPattern.test(message);
  }

  /**
   * Extract case number from message if present
   */
  extractCaseNumber(message: string): string | null {
    const caseNumberPattern = /G-\d+-\d{5}-\d+/i;
    const match = message.match(caseNumberPattern);
    return match ? match[0].toUpperCase() : null;
  }
}

export const chatbotService = new ChatbotService(); 