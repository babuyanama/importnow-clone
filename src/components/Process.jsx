
const steps = [
  {
    number: "01",
    title: "Share Your Requirement",
    description:
      "Tell us which product you want to import, your quantity and your target budget.",
  },
  {
    number: "02",
    title: "Supplier & Price Research",
    description:
      "We help identify potential Russian suppliers and coordinate pricing discussions.",
  },
  {
    number: "03",
    title: "Inspection & Shipping",
    description:
      "Coordinate quality checks, shipment arrangements and required import documentation.",
  },
  {
    number: "04",
    title: "Delivery in India",
    description:
      "Track the shipment and coordinate delivery to your agreed destination in India.",
  },
];

function Process() {
  return (
    <section className="process" id="process">
      <div className="section-heading">
        <span className="section-tag">OUR PROCESS</span>
        <h2>How it <span>works.</span></h2>
        <p>
          A clear process to help you move from product
          requirements to an import shipment.
        </p>
      </div>

      <div className="process-grid">
        {steps.map((step) => (
          <div className="process-card" key={step.number}>
            <div className="process-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Process;
