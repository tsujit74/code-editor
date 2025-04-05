import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2, Code, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export async function generateCodeWithGemini(
  prompt: string,
  language: string,
  apiKey: string,
  includeExplanation: boolean = false
): Promise<{ code: string; explanation?: string }> {
  try {
    let promptText = `Generate ${language} code: ${prompt}. Output ONLY raw executable code with no formatting.`;
    
    if (includeExplanation) {
      promptText = `Generate ${language} code: ${prompt}. 
      Provide the code first, then provide a detailed explanation that covers:
      1. What the code does
      2. Key functions/components
      3. How it works
      4. Any important design decisions
      
      Format your response as follows:
      CODE:
      [your code here]
      
      EXPLANATION:
      [your explanation here]`;
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Details:', errorData);
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    if (includeExplanation) {
      const parts = responseText.split(/CODE:|EXPLANATION:/i);
      let code = '', explanation = '';
      
      if (parts.length >= 3) {
        // Format for: [empty], [code], [explanation]
        code = parts[1].trim().replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
        explanation = parts[2].trim();
      } else if (parts.length === 2) {
        // If only one marker was found
        if (responseText.toUpperCase().includes('CODE:')) {
          code = parts[1].trim().replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
        } else if (responseText.toUpperCase().includes('EXPLANATION:')) {
          explanation = parts[1].trim();
        }
      } else {
        // Fallback if no markers found
        const codeMatch = responseText.match(/```[\w]*\n([\s\S]*?)\n```/);
        if (codeMatch && codeMatch[1]) {
          code = codeMatch[1].trim();
          explanation = responseText.replace(/```[\w]*\n[\s\S]*?\n```/, '').trim();
        } else {
          // Just use everything as code if no code blocks found
          code = responseText;
        }
      }
      
      return { code, explanation };
    } else {
      return { 
        code: responseText
          .replace(/^```[\w]*\n/, '')
          .replace(/\n```$/, '')
          .trim() 
      };
    }
  } catch (error) {
    console.error('Full error details:', error);
    throw new Error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}