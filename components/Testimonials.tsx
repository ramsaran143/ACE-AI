import React from 'react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    quote: "Ace AI is a game-changer. Turning my dense lecture notes into short videos made revision so much more effective and, dare I say, fun!",
    name: 'Sarah L.',
    role: 'Medical Student',
    avatar: 'https://picsum.photos/id/1027/100/100'
  },
  {
    quote: "The mock test generator is my favorite feature. It creates challenging questions that really test my understanding of the material. My grades have improved significantly.",
    name: 'David C.',
    role: 'Engineering Student',
    avatar: 'https://picsum.photos/id/1005/100/100'
  },
  {
    quote: "As an educator, I recommend Ace AI to all my students. It caters to visual learners and makes complex subjects more accessible. The AI Tutor is fantastic for after-hours help.",
    name: 'Dr. Emily R.',
    role: 'University Professor',
    avatar: 'https://picsum.photos/id/1011/100/100'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by Students & Educators</h2>
          <p className="text-lg text-gray-600 mt-2">Don't just take our word for it. Here's what they're saying.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-200 flex flex-col">
              <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
