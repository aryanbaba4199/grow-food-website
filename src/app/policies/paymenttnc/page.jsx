import React from "react";
import { Container, Typography, Card, Button, Divider, Box, List, ListItem, ListItemText } from "@mui/material";

const BusinessPage = () => {
  return (
    <div className="bg-gray-100 py-12">
      <Container>
        {/* Page Title */}
        <Typography variant="h3" className="text-center font-bold mb-8 text-gray-800">
          Grow Food Services
        </Typography>

        {/* Checkout Section */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            Checkout
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Complete your purchases securely with multiple payment options, including credit cards, debit cards,
            UPI, net banking, and wallets.
          </Typography>
          <Button variant="contained" color="primary" className="mt-4">
            Proceed to Checkout
          </Button>
        </Card>

        {/* Order History Section */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            Order History
          </Typography>
          <Typography className="text-gray-600 mb-4">
            View details of your past orders, including payment status and downloadable invoices.
          </Typography>
          <List className="bg-white rounded-md shadow-md">
            {[
              { order: "Order #12345", status: "Completed", amount: "₹2,450", date: "23 Nov 2024" },
              { order: "Order #12346", status: "Pending", amount: "₹1,200", date: "20 Nov 2024" },
            ].map((item, index) => (
              <ListItem key={index} className="border-b">
                <ListItemText
                  primary={`${item.order} - ${item.status}`}
                  secondary={`Amount: ${item.amount} | Date: ${item.date}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Invoice Generation Section */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            Invoice Generation
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Download invoices for your purchases in compliance with tax regulations.
          </Typography>
          <Button variant="contained" color="secondary">
            Download Latest Invoice
          </Button>
        </Card>

        {/* Secure Payment Section */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            Secure Payment Authentication
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Our platform ensures secure transactions using industry-standard protocols like 3D Secure and PCI DSS compliance.
          </Typography>
          <Typography className="text-gray-600">
            For credit card transactions, we implement advanced encryption and tokenization for maximum safety.
          </Typography>
        </Card>

        {/* FAQ/Help Section */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            FAQ/Help Section
          </Typography>
          <List className="bg-white rounded-md shadow-md">
            {[
              { question: "What happens if my payment fails?", answer: "You can retry the payment or contact support for assistance." },
              { question: "How do I request a refund?", answer: "Visit your order history and select the 'Request Refund' option." },
              { question: "Is my data secure?", answer: "Yes, all data is encrypted and handled per PCI DSS standards." },
            ].map((item, index) => (
              <ListItem key={index} className="border-b">
                <Typography className="font-bold">{item.question}</Typography>
                <Typography className="text-gray-600">{item.answer}</Typography>
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Refund and Dispute Mechanism */}
        <Card className="p-6 mb-6 shadow-md">
          <Typography variant="h5" className="font-bold mb-4 text-gray-800">
            Refund and Dispute Mechanism
          </Typography>
          <Typography className="text-gray-600 mb-4">
            If you encounter any issues, follow these steps to initiate a refund or resolve payment disputes:
          </Typography>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Go to your order history and select the order in question.</li>
            <li>Click on Request Refund and provide the necessary details.</li>
            <li>Our team will process your request within 7 working days.</li>
            <li>For disputes, contact us at <strong>support@thegrowfood.com</strong>.</li>
          </ul>
        </Card>

        {/* Contact Support Section */}
        <Box className="p-6 mt-8 bg-gray-200 rounded-md text-center">
          <Typography variant="h6" className="font-bold mb-2 text-gray-800">
            Need Assistance?
          </Typography>
          <Typography className="text-gray-600">
            Contact our support team at <strong>support@thegrowfood.com</strong> or call us at <strong>+91-8264103104</strong>.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default BusinessPage;
