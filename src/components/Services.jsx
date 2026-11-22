
const services = [
  {
    number: "01",
    title: "Supplier Sourcing",
    description:
      "Find potential Russian suppliers based on your product requirements, budget and business needs.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Supplier Verification",
    description:
      "Coordinate supplier checks and collect relevant business information before you proceed.",
    icon: "🤝",
  },
  {
    number: "03",
    title: "Product Quality Checks",
    description:
      "Arrange product inspections and quality checks before shipment, where available.",
    icon: "📦",
  },
  {
    number: "04",
    title: "Shipping Coordination",
    description:
      "Coordinate international freight options and shipment arrangements from Russia to India.",
    icon: "🚢",
  },
  {
    number: "05",
    title: "Customs Documentation",
    description:
      "Help coordinate import documents and connect the process with relevant customs professionals.",
    icon: "📄",
  },
  {
    number: "06",
    title: "Delivery Coordination",
    description:
      "Coordinate the next steps for moving your shipment towards its destination in India.",
    icon: "🚚",
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div className="section-heading">
        <span className="section-tag">WHAT WE DO</span>

        <h2>
          Importing made <span>simpler.</span>
        </h2>

        <p>
          From finding suppliers to coordinating delivery,
          get support throughout your import journey.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.number}>
            <div className="service-top">
              <span className="service-icon">{service.icon}</span>
              <span className="service-number">{service.number}</span>
            </div>

            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
