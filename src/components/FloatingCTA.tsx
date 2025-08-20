import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">      
      {/* Call Button */}
      <a
        href="tel:+15551234567"
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Call us"
      >
        <Phone className="w-6 h-6 group-hover:animate-pulse" />
      </a>
    </div>
  );
};

export default FloatingCTA;