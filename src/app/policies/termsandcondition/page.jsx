import React from "react";
import { Container, Typography } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <Container>
        {/* Page Title */}
        <Typography variant="h3" className="text-center font-bold mb-8 text-gray-800">
         Terms & Condition
        </Typography>

       
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Effective Date: [Insert Date]
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Welcome to <strong>The Grow Food</strong>. This Privacy Policy outlines how we collect, use, 
          disclose, and protect your information when you visit our website or use our services. Your privacy 
          is important to us, and we are committed to safeguarding it.
        </Typography>

        {/* Section 1: Information We Collect */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          1. Information We Collect
        </Typography>
        <Typography className="text-gray-600 mb-4">
          We collect various types of information to provide and improve our services:
        </Typography>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li><strong>Personal Information:</strong> Name, email address, phone number, business details.</li>
          <li><strong>Payment Information:</strong> Billing details, credit/debit card information, or other payment methods (processed securely).</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and other analytical data.</li>
          <li><strong>Cookies:</strong> To enhance your browsing experience and store user preferences.</li>
        </ul>

        {/* Section 2: How We Use Your Information */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          2. How We Use Your Information
        </Typography>
        <Typography className="text-gray-600 mb-4">
          The information we collect is used to:
        </Typography>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Provide, operate, and improve our services.</li>
          <li>Process orders and payments securely.</li>
          <li>Communicate with you regarding updates, offers, and promotions.</li>
          <li>Analyze usage trends to enhance our website and services.</li>
          <li>Comply with legal and regulatory requirements.</li>
        </ul>

        {/* Section 3: Payment Processing */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          3. Payment Processing
        </Typography>
        <Typography className="text-gray-600 mb-6">
          All payment transactions are processed securely through third-party payment gateways. We do not store 
          your credit/debit card details. These third-party payment processors adhere to strict PCI-DSS standards 
          and use advanced encryption to protect your data.
        </Typography>

        {/* Section 4: Data Sharing and Disclosure */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          4. Data Sharing and Disclosure
        </Typography>
        <Typography className="text-gray-600 mb-4">
          We may share your information in the following cases:
        </Typography>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>With trusted service providers who assist us in delivering our services (e.g., hosting, analytics).</li>
          <li>With payment gateways to process transactions securely.</li>
          <li>To comply with legal obligations, enforce our policies, or protect our rights.</li>
        </ul>

        {/* Section 5: Cookies and Tracking */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          5. Cookies and Tracking Technologies
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Our website uses cookies and similar technologies to enhance your experience. You can manage or disable 
          cookies through your browser settings, but some functionalities may be affected.
        </Typography>

        {/* Section 6: Data Security */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          6. Data Security
        </Typography>
        <Typography className="text-gray-600 mb-6">
          We implement advanced security measures to protect your data against unauthorized access, disclosure, or loss. 
          Despite our efforts, no method of transmission or storage is 100% secure.
        </Typography>

        {/* Section 7: Your Rights */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          7. Your Rights
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Depending on your location, you may have the following rights:
        </Typography>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Access and review your personal information.</li>
          <li>Request corrections to inaccurate data.</li>
          <li>Request the deletion of your data (subject to legal obligations).</li>
          <li>Opt-out of marketing communications.</li>
        </ul>

        {/* Section 8: Children's Privacy */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          8. {`${"Children's Privacy"}`}
        </Typography>
        <Typography className="text-gray-600 mb-6">
          Our services are not intended for children under the age of 13. We do not knowingly collect personal 
          information from children. If we become aware of such data, we will delete it promptly.
        </Typography>

        {/* Section 9: Updates to This Policy */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          9. Updates to This Policy
        </Typography>
        <Typography className="text-gray-600 mb-6">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an 
          updated effective date. Your continued use of our services indicates acceptance of the revised terms.
        </Typography>

        {/* Contact Section */}
        <Typography variant="h5" className="font-bold mt-8 mb-4 text-gray-800">
          Contact Us
        </Typography>
        <Typography className="text-gray-600">
          If you have any questions or concerns about this Privacy Policy, please contact us at: 
        </Typography>
        <Typography className="text-gray-600 mt-2">
          <strong>Email:</strong> support@thegrowfood.com
        </Typography>
        <Typography className="text-gray-600">
          <strong>Phone:</strong>+91-8264103104
        </Typography>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
