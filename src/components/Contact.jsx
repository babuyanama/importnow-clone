
import { useState } from "react";

const API_URL =
  "https://importnow-clone-production-91f33528.up.railway.app/api/enquiries";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: "",
    quantity: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setSubmitted(false);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      let result = {};

      if (responseText.trim()) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Server returned an invalid response (HTTP ${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Request failed. HTTP status: ${response.status}`
        );
      }

      if (!responseText.trim()) {
        throw new Error(
          "Server returned an empty response. Please try again."
        );
      }

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        product: "",
        quantity: "",
        details: "",
      });

    } catch (error) {
      console.error("Enquiry submission error:", error);

      setError(
        error.message || "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">

        <div className="contact-info">
          <span className="section-tag">GET IN TOUCH</span>

          <h2>
            Ready to start your
            <span> import journey?</span>
          </h2>

          <p>
            Tell us what you are looking to import from Russia.
            Our team can review your requirements and discuss
            the next steps.
          </p>

          <div className="contact-detail">
            <span>📍</span>
            <div>
              <h4>Destination</h4>
              <p>India</p>
            </div>
          </div>

          <div className="contact-detail">
            <span>🌍</span>
            <div>
              <h4>Source Market</h4>
              <p>Russia</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Request a Free Quote</h3>

          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="product">Product You Want to Import</label>
          <input
            id="product"
            type="text"
            name="product"
            placeholder="Enter product name"
            value={formData.product}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Required Quantity</label>
          <input
            id="quantity"
            type="text"
            name="quantity"
            placeholder="Example: 500 kg"
            value={formData.quantity}
            onChange={handleChange}
          />

          <label htmlFor="details">Additional Details</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            placeholder="Tell us about your requirements"
            value={formData.details}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request →"}
          </button>

          {submitted && (
            <p className="success-message">
              Your enquiry was received successfully!
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
        </form>

      </div>
    </section>
  );
}

export default Contact;
