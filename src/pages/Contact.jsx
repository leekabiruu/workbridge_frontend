import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import '../index.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      
      const submittedData = { ...formData };
      
      setStatus({
        message: "Your message has been sent. We'll get back to you soon!",
        type: "success",
        submittedData
      });
      
      
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
      }, 100);
    } catch (error) {
      setStatus({
        message: "❌ Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="text-center py-10 bg-gradient-to-r from-teal-600 to-blue-700 text-white">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-lg opacity-90">We’d love to hear from you! Reach out with any questions or feedback.</p>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-teal-700">Get in Touch</h2>
          <p className="mb-4 text-gray-600">
            We're here to help with any inquiries or support you may need.
          </p>
          <ul className="space-y-3">
            <li><strong>Email:</strong> <a href="mailto:info@WorkBridge.com" className="text-teal-600 hover:underline">info@WorkBridge.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+254 734567890" className="text-teal-600 hover:underline">+254 73 456 7890</a></li>
            <li><strong>Address:</strong> 45 Talent Avenue, 7th Floor, Upper Hill, Nairobi, KE 00100</li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-teal-700">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {status.message && (
            <div className={`mt-6 p-4 rounded-lg border ${
              status.type === "success" 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {status.type === "success" ? "✅" : "❌"}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">
                    {status.type === "success" ? "Message Sent Successfully!" : "Error Sending Message"}
                  </h3>
                  <p className="text-sm mt-1">{status.message}</p>
                  {status.type === "success" && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <h4 className="font-medium text-gray-900">Your Message:</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Name:</strong> {status.submittedData?.name || "[Submitted]"}<br/>
                        <strong>Email:</strong> {status.submittedData?.email || "[Submitted]"}<br/>
                        <strong>Message:</strong> {status.submittedData?.message || "[Submitted]"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        We'll respond within 24 hours to your email address.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-100 py-8 text-center">
        <h2 className="text-xl font-semibold mb-3 text-teal-700">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gray-600 hover:text-teal-600 transition"
          >
            <FaFacebook size={26} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-600 hover:text-teal-600 transition"
          >
            <FaInstagram size={26} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-600 hover:text-teal-600 transition"
          >
            <FaLinkedin size={26} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
