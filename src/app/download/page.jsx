'use client'

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getterFunction, getUserApi, getOrderApi } from "@/Api";

const InvoicePage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PageContent />
    </Suspense>
  );
};

const PageContent = () => {
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid");
  const uid = searchParams.get("uid");

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await getterFunction(`${getOrderApi}/${oid}`);
        const userRes = await getterFunction(`${getUserApi}/${uid}`);
        
        setOrder(orderRes[0]); // Assuming response is an array
        setUser(userRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (oid && uid) {
      fetchData();
    }
  }, [oid, uid]);

  useEffect(() => {
    if (order && user) {
      setTimeout(() => {
        downloadPDF();
      }, 1000);
    }
  }, [order, user]);

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoice-container");

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${order._id}.pdf`);
      
      setTimeout(() => {
        window.close();
      }, 500);
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!order || !user) return <p>Order or user not found.</p>;

  return (
    <div id="invoice-container" className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <img src="/favicon.ico" alt="Company Logo" className="w-20" />
          <p className="font-bold text-[#15892e] text-lg">Grow Food</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold">Invoice</h1>
          <span>support@thegrowfood.com</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-lg font-semibold">Billed To:</h2>
          <p className="text-gray-700">{user.shopName}</p>
          <p className="text-gray-600">{order.address?.locality}, {order.address?.city}, {order.address?.state}</p>
          <p className="text-gray-600">+91-{order.address?.mobile}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Invoice Details:</h2>
          <p className="text-gray-700">Invoice #: {order._id}</p>
          <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
          <p className="text-gray-600">Payment Mode: {order.paymentMode}</p>
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
          {order.products.map((product, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2">₹{product.price.toFixed(2)}</td>
              <td className="border p-2">₹{product.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 text-right">
        <div>
          <p className="text-gray-700">Subtotal: ₹{order.products.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
          <p className="text-gray-700">Delivery Charge: ₹ Free</p>
          <p>___________________________________</p>
          <h2 className="text-xl font-bold">Total: ₹ {parseInt(order.products.reduce((sum, item) => sum + item.totalPrice, 0))}</h2>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
