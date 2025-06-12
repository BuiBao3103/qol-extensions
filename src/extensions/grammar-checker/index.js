import { marked } from 'marked';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GRAMMAR_CHECK_PROMPT } from './prompts';

class GrammarChecker {
    constructor() {
        this.genAI = null;
        
        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false,
            sanitize: true
        });

        // Initialize with API key from storage
        this.initializeAI();
    }

    async initializeAI() {
        try {
            const result = await chrome.storage.sync.get(['apiKeys']);
            if (result.apiKeys?.google) {
                this.genAI = new GoogleGenerativeAI(result.apiKeys.google);
            }
        } catch (error) {
            console.error('Failed to initialize AI:', error);
        }
    }

    async checkGrammar(text) {
        try {
            if (!this.genAI) {
                throw new Error('Google AI API key not found. Please add your API key in Settings.');
            }

            const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = GRAMMAR_CHECK_PROMPT.template(text);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();
            return marked.parse(responseText);
        } catch (error) {
            throw new Error(`Failed to check grammar: ${error.message}`);
        }
    }
}

export default GrammarChecker; 