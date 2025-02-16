import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/Component/helpers/ClientProvider";
import 'react-multi-carousel/lib/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grow Food",
  description: "B2B Solutions for restaurants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} mt-12`}>
        {/* Wrap the children with the ClientProvider */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
