import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Turn Your Notes into <span className="text-indigo-600">Videos</span> Instantly with Ace AI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Upload your study materials, and let our AI summarize, visualize, and transform them into engaging videos and quizzes. Learning just got a futuristic upgrade.
        </p>
        <a href="#demo" className="bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
          Get Started for Free
        </a>
      </div>
    </section>
  );
};

export default Hero;
