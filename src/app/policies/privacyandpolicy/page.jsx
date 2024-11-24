import React from "react";
import { Container, Typography, Divider, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 py-12">
      <Container>
        {/* Page Title */}
        <Typography variant="h3" className="font-bold text-center mb-6 text-gray-800">
          Privacy Policy
        </Typography>
        <Typography className="text-gray-600 mb-6 text-center">
          Effective Date: November 24, 2024
        </Typography>
        <Divider className="mb-6" />

        {/* Introduction */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Introduction
          </Typography>
          <Typography className="text-gray-600">
            Welcome to **The Grow Food**. Your privacy is important to us, and we are committed to safeguarding your
            personal and financial information. This Privacy Policy explains how we collect, use, and share your data
            when you use our website and mobile application.
          </Typography>
        </Box>

        {/* Data Collection */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Data Collection and Usage
          </Typography>
          <Typography className="text-gray-600 mb-4">
            We collect the following types of information:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and delivery address.</li>
            <li><strong>Payment Information:</strong> Credit/debit card details, UPI IDs, and other payment methods. Note: We do not store card details directly. Payments are processed by secure third-party gateways.</li>
            <li><strong>Usage Data:</strong> Browsing patterns, purchase history, and device information.</li>
          </ul>
          <Typography className="text-gray-600 mt-4">
            This information is used to process orders, provide personalized recommendations, improve our services, and
            comply with legal obligations.
          </Typography>
        </Box>

        {/* Data Sharing */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Data Sharing and Disclosure
          </Typography>
          <Typography className="text-gray-600">
            We may share your data with:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Payment processors like Razorpay or Stripe for transaction handling.</li>
            <li>Logistics providers to ensure smooth delivery of orders.</li>
            <li>Law enforcement or regulatory authorities when required by law.</li>
          </ul>
          <Typography className="text-gray-600 mt-4">
            We do not sell your personal information to third parties for marketing purposes.
          </Typography>
        </Box>

        {/* Data Security */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Data Security
          </Typography>
          <Typography className="text-gray-600">
            Your data is protected using industry-standard encryption and secure protocols. We comply with 
            <strong> PCI DSS</strong> standards for payment processing and regularly update our systems to prevent
            unauthorized access.
          </Typography>
        </Box>

        {/* User Rights */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Your Rights
          </Typography>
          <Typography className="text-gray-600 mb-4">
            As a user, you have the following rights:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Access your personal information.</li>
            <li>Request corrections to your data.</li>
            <li>Opt-out of marketing communications.</li>
            <li>Delete your account and associated data.</li>
          </ul>
          <Typography className="text-gray-600 mt-4">
            To exercise these rights, contact us at <strong>privacy@thegrowfood.com</strong>.
          </Typography>
        </Box>

        {/* Cookies Policy */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Cookies and Tracking
          </Typography>
          <Typography className="text-gray-600">
            We use cookies to enhance your browsing experience and analyze site performance. You can manage your cookie
            preferences in your browser settings.
          </Typography>
        </Box>

        {/* Refunds and Disputes */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Refunds and Dispute Resolution
          </Typography>
          <Typography className="text-gray-600">
            If you encounter issues with a purchase, you can request a refund via our <strong>Order History</strong> page.
            Refund requests are processed within 7-10 business days. For disputes, contact us at
            <strong> support@thegrowfood.com</strong>.
          </Typography>
        </Box>

        {/* Policy Updates */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Updates to this Policy
          </Typography>
          <Typography className="text-gray-600">
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We
            recommend reviewing this page regularly for the latest information.
          </Typography>
        </Box>

        {/* Contact Us */}
        <Box className="mt-12 p-6 bg-gray-100 rounded-md text-center">
          <Typography variant="h6" className="font-bold mb-2 text-gray-800">
            Contact Us
          </Typography>
          <Typography className="text-gray-600">
            If you have any questions or concerns, reach out to us at:
          </Typography>
          <Typography className="font-bold mt-2 text-gray-800">privacy@thegrowfood.com</Typography>
        </Box>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
