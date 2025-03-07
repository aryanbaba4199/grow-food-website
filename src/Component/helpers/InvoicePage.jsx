'use client'
import React, { useContext, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import UserContext from "@/userContext";

const InvoicePage = ({ bill, download }) => {
  const { user } = useContext(UserContext);
  const [dText, setDText] = useState('Download')

  const formattedDate = new Date(bill.date).toLocaleDateString("en-GB").split("/").join("");
  const invoiceNumber = `INV-${formattedDate}-${bill.orderId.slice(-4)}`;

  const invoiceData = {
    invoiceNumber,
    date: new Date(bill.date).toLocaleDateString(),
    dueDate: bill.paymentMode,
    company: {
      name: "Grow Food",
      address: "Surat, Gujarat",
      phone: "+91 983577668",
      email: "support@thegrowfood.com",
    },
    client: {
      name: user.shopName,
      address: `${bill.address?.locality}, ${bill.address?.city}, ${bill.address?.state}`,
      phone: `+91-${bill.address.mobile}`,
      email: user.email,
    },
    items: bill.products.map((product, index) => ({
      id: index + 1,
      name: product.name,
      qty: product.quantity,
      price: product.price,
      totalPrice: product.totalPrice,
    })),
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const downloadPDF = () => {
    if(dText==='Downloading'){
      return;
    }
    setDText('Downloding')
    const invoiceElement = document.getElementById("invoice-container");

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
    });
    setDText('Download')
  };

  return (
    <>
    <div id="invoice-container" className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="">
        <img src="/favicon.ico" alt="Company Logo" className="w-20" />
        <p className="font-bold text-[#15892e] text-lg">Grow Food</p>
        </div>
        <div className=" flex flex-col justify-end items-end">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <span>support@thegrowfood.com</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-lg font-semibold">Billed To:</h2>
          <p className="text-gray-700">{invoiceData.client.name}</p>
          <p className="text-gray-600">{invoiceData.client.address}</p>
          <p className="text-gray-600">{invoiceData.client.phone}</p>
          <p className="text-gray-600">{invoiceData.client.email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Invoice Details:</h2>
          <p className="text-gray-700">Invoice #: {invoiceData.invoiceNumber}</p>
          <p className="text-gray-600">Date: {invoiceData.date}</p>
          <p className="text-gray-600">Due Date: {invoiceData.dueDate}</p>
        </div>
      </div>

      <table className="w-full mt-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Product</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.qty}</td>
              <td className="border p-2">₹{item.price.toFixed(2)}</td>
              <td className="border p-2">₹{item.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 text-right">
        <div>
          <p className="text-gray-700">Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p className="text-gray-700">Delivery Charge : ₹ Free</p>
          {/* <p className="text-gray-700">Tax (18%): ₹{tax.toFixed(2)}</p> */}
          <p>___________________________________</p>
          <h2 className="text-xl font-bold">Total: ₹ {parseInt(subtotal)}</h2>
        </div>
      </div>
      {/* <div className="absolute bottom-16">
          <p className="font-semibold">Terms and Condition</p>
          <p className="font-thin">You can not return used materials</p>
          <p className="font-thin">Currently its GST Inclusive soon you will get Exclusive</p>
          <p className="font-thin">Check Expiry before use </p>
      </div> */}

    
    </div>
    <div className="flex justify-end px-4 py-4  mt-6">
        <Button disabled={dText!=='Download'} variant="outlined" color="secondary" startIcon={<FaRegFilePdf />} onClick={downloadPDF}>
          {dText}
        </Button>
        
      </div>
    </>
  );
};

export default InvoicePage;