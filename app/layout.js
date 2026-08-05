import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Dukaan — Online Store",
  description: "Custom e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-line mt-16 py-8 text-center text-sm text-ink/50 font-body">
            © {new Date().getFullYear()} Dukaan. All rights reserved.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
