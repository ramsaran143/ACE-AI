import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import DemoSection from './components/DemoSection';
import SmartTutor from './components/SmartTutor';
import QuizGenerator from './components/QuizGenerator';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative">
          <Header />
          <Hero />
        </div>
      </div>
      
      <main>
        <Features />
        <DemoSection />
        <SmartTutor />
        <QuizGenerator />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
