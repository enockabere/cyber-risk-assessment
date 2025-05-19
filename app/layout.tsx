import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionWrapper from "./components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Cyber Risk Assessment Portal",
  description: "Assess cyber security risk for universities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-background text-foreground">
        <SessionWrapper>
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
