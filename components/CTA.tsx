import React from 'react';

const CTA: React.FC = () => {
  return (
    <section id="cta" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-12 rounded-2xl text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Studies?</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Join thousands of students revolutionizing the way they learn. Get started with Ace AI today and unlock your full potential.
          </p>
          <a href="#demo" className="bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
            Sign Up & Try For Free
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
