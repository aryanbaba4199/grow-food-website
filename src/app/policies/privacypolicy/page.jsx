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
          Effective Date: December 4, 2024
        </Typography>
        <Divider className="mb-6" />

        {/* Introduction */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Introduction
          </Typography>
          <Typography className="text-gray-600">
            Welcome to **The Grow Food**. Protecting your privacy is our top priority, and we are dedicated to securing your personal information. This Privacy Policy outlines how we collect, use, and share your data when you interact with our website or mobile application.
          </Typography>
        </Box>

        {/* Information We Collect */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Information We Collect
          </Typography>
          <Typography className="text-gray-600 mb-4">
            We collect the following types of information:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, delivery address, and payment details.
            </li>
            <li>
              <strong>Payment Information:</strong> Payment data like credit/debit card details or UPI IDs are processed securely by third-party payment gateways.
            </li>
            <li>
              <strong>Usage Data:</strong> Device information, IP address, browsing history, and purchase patterns to enhance your experience.
            </li>
            <li>
              <strong>Location Data:</strong> Approximate location to deliver location-based services (e.g., delivery updates).
            </li>
          </ul>
        </Box>

        {/* How We Use Your Information */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            How We Use Your Information
          </Typography>
          <Typography className="text-gray-600">
            Your information is used for the following purposes:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>To process and fulfill your orders.</li>
            <li>To communicate with you about your account, orders, or promotional offers.</li>
            <li>To improve our services through data analysis.</li>
            <li>To comply with legal obligations and resolve disputes.</li>
          </ul>
        </Box>

        {/* Information Sharing */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Information Sharing
          </Typography>
          <Typography className="text-gray-600 mb-4">
            We may share your information with:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>
              <strong>Third-Party Providers:</strong> Payment processors, delivery partners, and analytics tools to enable our services.
            </li>
            <li>
              <strong>Compliance with Laws:</strong> Legal authorities or regulators if required by law.
            </li>
          </ul>
          <Typography className="text-gray-600">
            We never sell your personal information to third parties.
          </Typography>
        </Box>

        {/* Data Security */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Data Security
          </Typography>
          <Typography className="text-gray-600">
            We prioritize the security of your personal data by implementing industry-standard encryption and secure protocols. Regular updates and security audits ensure protection against unauthorized access.
          </Typography>
        </Box>

        {/* Your Rights */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Your Rights
          </Typography>
          <Typography className="text-gray-600">
            As a user, you have the right to:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Access and review your personal data.</li>
            <li>Request updates or corrections to your information.</li>
            <li>Opt-out of marketing communications at any time.</li>
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
            We use cookies to improve functionality, analyze performance, and deliver personalized content. You can manage your cookie preferences in your browser settings.
          </Typography>
        </Box>

        {/* Children’s Privacy */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Children’s Privacy
          </Typography>
          <Typography className="text-gray-600">
            Our services are not directed at children under 13 years of age. We do not knowingly collect data from children. If we discover that personal data of a child has been collected, we will delete it promptly.
          </Typography>
        </Box>

        {/* Changes to This Policy */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Updates to this Policy
          </Typography>
          <Typography className="text-gray-600">
            This Privacy Policy may be updated periodically to reflect changes in our practices or regulatory requirements. We encourage you to review this page regularly for the latest information.
          </Typography>
        </Box>

        {/* Contact Us */}
        <Box className="mt-12 p-6 bg-gray-100 rounded-md text-center">
          <Typography variant="h6" className="font-bold mb-2 text-gray-800">
            Contact Us
          </Typography>
          <Typography className="text-gray-600">
            If you have any questions or concerns about this Privacy Policy, contact us at:
          </Typography>
          <Typography className="font-bold mt-2 text-gray-800">
            privacy@thegrowfood.com
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
