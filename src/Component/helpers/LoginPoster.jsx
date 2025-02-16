import React from 'react';
import { FaLeaf, FaTruck, FaShieldAlt } from 'react-icons/fa'; // Icons for quality, delivery, and trust


const LoginPoster = () => {
  return (
    <div className="min-h-screen flex  bg-gradient-to-r from-yellow-400 to-yellow-500">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
       

        <div className="p-2 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold text-yellow-600 mb-6">Grow Food - India's First Raw Delivery Service</h2>
          <p className="text-lg text-gray-600 mb-4">Providing high-quality, fresh ingredients directly to restaurants</p>
          
          {/* Key Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <FaLeaf className="text-yellow-600 text-4xl mb-2" />
              <h3 className="text-xl font-semibold">Quality</h3>
              <p className="text-gray-600">Fresh, raw ingredients sourced from the best farms to ensure top-notch quality.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaTruck className="text-yellow-600 text-4xl mb-2" />
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">Get your ingredients delivered to your restaurant quickly and safely.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-yellow-600 text-4xl mb-2" />
              <h3 className="text-xl font-semibold">Trust</h3>
              <p className="text-gray-600">We ensure that every product is trustworthy, safe, and ready for use in your kitchen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPoster;
