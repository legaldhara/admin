import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);
    navigate('/'); // Navigate back to login page
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-2xl font-bold">Terms & Conditions</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6">
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
                <p className="text-gray-700">
                  Welcome to NexaShopping, owned by Ramkesh Lodhi. By accessing or using our platform, 
                  you agree to comply with and be bound by these Terms & Conditions.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">2. Information We Collect</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Personal identifiers (name, email, phone number)</li>
                  <li>Account credentials</li>
                  <li>Transaction information</li>
                  <li>Device information</li>
                  <li>Usage data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">3. How We Use Information</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Provide and improve our Service</li>
                  <li>Process transactions</li>
                  <li>Communicate with you</li>
                  <li>Customer support</li>
                  <li>Security protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">4. Ownership</h3>
                <p className="text-gray-700">
                  NexaShopping is owned and operated by Ramkesh Lodhi. All rights reserved.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">5. Refund Policy</h3>
                <p className="text-gray-700">
                  We do not provide any returns or refunds. All sales are final.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-2">6. Contact Us</h3>
                <p className="text-gray-700">
                  Email: privacy@nexashopping.com<br />
                  Address: 123 App Street, Tech City
                </p>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;