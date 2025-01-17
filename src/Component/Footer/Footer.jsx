import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#232f3e] text-white">
      {/* Back to Top */}
      <div className="bg-[#37475a] py-3 text-center cursor-pointer hover:bg-[#485769] transition">
        <a href="#top" className="text-sm font-medium">Back to top</a>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div className="flex justify-start flex-col">
          <h4 className="font-bold text-lg mb-4">Get to Know Us</h4>
          <ul className="space-y-2 text-sm flex justify-start items-center flex-col">
            <Link href={'/policies/aboutus'}>About us</Link>
            <Link href={'/policies/privacypolicy'}>Privacy Policy</Link>
            <Link href={'/policies/termsandcondition'}>Terms and Condition</Link>
            <Link href={'/policies/paymenttnc'}>Refund Policies</Link>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-bold text-lg mb-4">Connect with Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-bold text-lg mb-4">Make Money with Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Sell on The Grow Food</a></li>
            <li><a href="#" className="hover:underline">Request a callback</a></li>
            <li><a href="#" className="hover:underline">Affiliate Marketing</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-bold text-lg mb-4">Let Us Help You</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Your Account</a></li>
            <li><a href="#" className="hover:underline">Returns Center</a></li>
            <li><a href="#" className="hover:underline">Help</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#131a22] py-4 p-x4 flex justify-center items-center">
        <div className=" text-sm flex justify-center items-center">
          <p className="w-full">&copy; {new Date().getFullYear()} The Grow Food. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
