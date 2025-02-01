'use client'
import axios from "axios";
import dynamic from "next/dynamic";
import { decryptData } from "./userFunction";
import imageCompression from "browser-image-compression";

// Dynamically import jsPDFInvoiceTemplate only on the client side
const jsPDFInvoiceTemplate = dynamic(() => import("jspdf-invoice-template"), {
  ssr: false,
});

const cloudinaryApi = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudinarySecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

const deleteImageFromCloudinary = async (imageId) => {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId }),
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      console.error("Image deletion failed:", response.data);
      return data;
    }
  } catch (e) {
    const data = { error: e, success: false };
    console.error("Error deleting image from Cloudinary:", e);
    return e;
  }
};

export default deleteImageFromCloudinary;

export const uploadImageToCloudinary = async (image) => {
  try {
    // Compress the image
    const compressedImage = await compressImage(image);
    console.log(cloudinaryName, cloudinaryPreset);
    const formData = new FormData();
    formData.append("file", compressedImage);
    formData.append("upload_preset", cloudinaryPreset);

    const cloudinaryResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
      formData
    );

    const data = { response: true, data: cloudinaryResponse.data };
    return data;
  } catch (e) {
    const data = { response: false, error: e };
    return { data };
  }
};

// Function to compress the image
const compressImage = async (image) => {
  const options = {
    maxSizeMB: 1, // Maximum size in MB (e.g., 1MB)
    maxWidthOrHeight: 1080, // Maximum width or height of the image
    useWebWorker: true, // Use a web worker for compression
    fileType: "image/webp", // Convert to WebP format
  };

  try {
    const compressedFile = await imageCompression(image, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export const generatePDF = ({ data }) => {
  if (data && data !== undefined) {
    const { user, products } = data;

    // Define invoice properties
    const props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: user.name,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "https://i.pinimg.com/736x/b3/f2/57/b3f25772365d3fbea540bab037efb327.jpg",
        type: "PNG",
        width: 53.33,
        height: 26.66,
        margin: { top: 0, left: 0 },
      },
      stamp: {
        inAllPages: true,
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
        type: "JPG",
        width: 20,
        height: 20,
        margin: { top: 0, left: 0 },
      },
      business: {
        name: "Grow Food",
        address: "Sachin, Surat, Gujarat",
        phone: "+917005742790",
        email: "warriorsgrowfood@gmail.com",
        website: "growfood.in",
      },
      contact: {
        label: "Invoice issued for:",
        name: user.name,
        address: user.address,
        phone: user.mobile,
        email: user.email,
      },
      invoice: {
        label: "Invoice #: ",
        num: 19,
        invDate: "Payment Date: 01/01/2021 18:12",
        invGenDate: "Invoice Date: 02/02/2021 10:17",
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          { title: "#" },
          { title: "Title" },
          { title: "Brand" },
          { title: "Price" },
          { title: "Quantity" },
          { title: "Unit" },
          { title: "Total" },
        ],
        // Create table data dynamically from products
        table: products.map((product, index) => [
          index + 1,
          product.title,
          product.brand,
          product.price,
          product.quantity,
          product.unit,
          product.price * product.quantity,
        ]),
        additionalRows: [
          {
            col1: "Total:",
            col2: products
              .reduce((sum, p) => sum + p.price * p.quantity, 0)
              .toFixed(2),
            col3: "INR",
            style: { fontSize: 14 },
          },
          { col1: "GST:", col2: "18", col3: "%", style: { fontSize: 10 } },
          {
            col1: "SubTotal:",
            col2: (
              products.reduce((sum, p) => sum + p.price * p.quantity, 0) * 1.18
            ).toFixed(2),
            col3: "INR",
            style: { fontSize: 10 },
          },
        ],
        invDescLabel: "Invoice Note",
        invDesc: "Thank you for your business with Grow Food!",
      },
      footer: {
        text: "The invoice is created electronically and is valid without the signature and stamp.\nTerms & Conditions:\n1. Goods once sold will not be taken back.\n2. Payment is due within 30 days.\n3. Late payments may incur additional charges.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };

    // Generate PDF using the template
    const pdfCreated = jsPDFInvoiceTemplate(props);

    // Save the PDF
    pdfCreated.jsPDFDocObject.save();
  }
};

export const getUserGeoLocation = async () => {
  if (!navigator.geolocation) {
    return {
      response: false,
      data: "Geolocation is not supported by this browser.",
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = process.env.NEXT_PUBLIC_MAP_KEY; // Ensure this key is correctly set in your .env file
          const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            const location = data.results[0].formatted;
            resolve({ response: true, data: location });
          } else {
            resolve({
              response: false,
              data: "No location found for the given coordinates.",
            });
          }
        } catch (error) {
          resolve({ response: false, data: error.message });
        }
      },
      (error) => {
        resolve({ response: false, data: error.message });
      }
    );
  });
};

export const whosVisiting = () => {
  const user = decryptData(localStorage.getItem("user"));

  if (user && user.user.userStatus === "Verified") {
    if (user.user.userType === "Admin") {
      return "Admin";
    } else if (user.user.userType === "Vendor") {
      return "Vendor";
    } else if (user.user.userType === "Restaurant") {
      return "Restaurant";
    }
  }
};
