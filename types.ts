// Fix: Import React to resolve namespace errors.
import React from 'react';

// FIX: Removed the conflicting 'declare global' block for 'window.aistudio'.
// The error "Property 'aistudio' must be of type 'AIStudio'" indicates that a
// global type is already provided by the environment, and re-declaring it
// caused a conflict.

export interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}