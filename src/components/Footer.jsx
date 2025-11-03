import { Link } from "react-router-dom";
import '../index.css';

export default function Footer() {
  return (
    <footer className="bg-white border-t text-gray-600 py-6 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p>© {new Date().getFullYear()} WorkBridge. All rights reserved.</p>

        <div className="flex flex-wrap justify-center md:justify-end gap-6">
          <Link to="/about" className="hover:text-white transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact
          </Link>
          <Link to="/policy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
