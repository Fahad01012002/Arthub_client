import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import RoleAssigner from "./components/RoleAssigner";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtHub — Where Art Meets Its Collector",
  description: "A global marketplace connecting artists and collectors through the power of original art.",
};

export default function RootLayout({ children }) {
  return (
    <html
      data-theme="dark"
      lang="en"
      className={`${poppins.className} dark h-full antialiased`}
    >
      <body className="min-h-full bg-black flex flex-col">
        <ToastContainer />
        <RoleAssigner />
        <Navbar />
        {children}
        <Footer />
        </body>
    </html>
  );
}
