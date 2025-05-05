import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/Component/helpers/ClientProvider";
import "react-multi-carousel/lib/styles.css";
import Script from "next/script"; // Import Next.js Script component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grow Food",
  description: "B2B Solutions for restaurants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Maps JavaScript API */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAi2MQyWnPyrSAY_jny04NPMKWoXZH5M1c&libraries=places"
          strategy="beforeInteractive" // Load script before the page becomes interactive
        />
      </head>
      <body className={`${inter.className} mt-12`}>
        {/* Wrap the children with the ClientProvider */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}