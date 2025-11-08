import React from 'react';
import { Feature } from '../types';
import UploadIcon from './icons/UploadIcon';
import VideoIcon from './icons/VideoIcon';
import TutorIcon from './icons/TutorIcon';
import QuizIcon from './icons/QuizIcon';
import FileIcon from './icons/FileIcon';

const features: Feature[] = [
  {
    icon: UploadIcon,
    title: 'Upload & Understand',
    description: 'Effortlessly upload PDFs, text, or notes. Our AI quickly extracts and comprehends the core concepts.'
  },
  {
    icon: VideoIcon,
    title: 'Summarize & Create Videos',
    description: 'Ace AI generates concise summaries and converts them into dynamic study videos, complete with your own images.'
  },
  {
    icon: TutorIcon,
    title: 'Smart Guidance',
    description: 'Our AI tutor is available 24/7 to guide you through complex topics with interactive conversations.'
  },
  {
    icon: QuizIcon,
    title: 'Mock Test Generator',
    description: 'Create personalized quizzes and tests from your study materials to master your subjects and ace your exams.'
  },
  {
    icon: FileIcon,
    title: 'Multi-format Support',
    description: 'We accept all your study materials, from handwritten notes to Word documents and PDFs.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">A Smarter Way to Study</h2>
          <p className="text-lg text-gray-600 mt-2">Everything you need to turn study sessions into success stories.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
              <div className="bg-indigo-100 text-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center mb-5">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
