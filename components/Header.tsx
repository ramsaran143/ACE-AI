import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <a href="#" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span>Ace AI</span>
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
          <a href="#demo" className="text-gray-600 hover:text-indigo-600">Demo</a>
          <a href="#tutor" className="text-gray-600 hover:text-indigo-600">Tutor</a>
           <a href="#quiz" className="text-gray-600 hover:text-indigo-600">Quiz</a>
          <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
        </div>
        <div className="hidden md:block">
          <a href="#cta" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">Try Now</a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <a href="#features" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#demo" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Demo</a>
          <a href="#tutor" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Tutor</a>
          <a href="#quiz" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Quiz</a>
          <a href="#testimonials" className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Testimonials</a>
          <a href="#cta" className="block py-3 px-4 text-center bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors" onClick={() => setIsOpen(false)}>Try Now</a>
        </div>
      )}
    </header>
  );
};

export default Header;
