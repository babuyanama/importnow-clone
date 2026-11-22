
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-about">
          <h2 className="footer-logo">
            IMPORT<span>NOW</span>
          </h2>

          <p>
            Helping Indian businesses explore sourcing
            opportunities from Russia with import assistance
            and shipping coordination.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#process">How It Works</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-links">
          <h3>Our Services</h3>
          <a href="#services">Supplier Sourcing</a>
          <a href="#services">Supplier Verification</a>
          <a href="#services">Quality Checks</a>
          <a href="#services">Shipping Coordination</a>
          <a href="#services">Customs Documentation</a>
        </div>

        <div className="footer-contact">
          <h3>Import Assistance</h3>
          <p>Russia → India</p>
          <a href="#contact" className="footer-button">
            Get a Quote →
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 ImportNow. All rights reserved.</p>
        <a href="#home">Back to Top ↑</a>
      </div>
    </footer>
  );
}

export default Footer;
