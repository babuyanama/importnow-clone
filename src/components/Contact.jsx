
import { useState } from "react";

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
      const response = await fetch(
        "http://localhost:5000/api/enquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
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
      console.error("Submission error:", error);
      setError(error.message || "Something went wrong!");
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

          <label>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Product You Want to Import</label>
          <input
            type="text"
            name="product"
            placeholder="Enter product name"
            value={formData.product}
            onChange={handleChange}
            required
          />

          <label>Required Quantity</label>
          <input
            type="text"
            name="quantity"
            placeholder="Example: 500 kg"
            value={formData.quantity}
            onChange={handleChange}
          />

          <label>Additional Details</label>
          <textarea
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

          <p className="form-note">
            Your enquiry is being sent to our backend.
          </p>
        </form>

      </div>
    </section>
  );
}

export default Contact;
