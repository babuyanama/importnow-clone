
function Destinations() {
  const destinations = [
    {
      city: "Mumbai",
      state: "Maharashtra",
      port: "Nhava Sheva Port",
    },
    {
      city: "Delhi",
      state: "New Delhi",
      port: "Inland delivery",
    },
    {
      city: "Hyderabad",
      state: "Telangana",
      port: "Inland delivery",
    },
    {
      city: "Chennai",
      state: "Tamil Nadu",
      port: "Chennai Port",
    },
    {
      city: "Bangalore",
      state: "Karnataka",
      port: "Inland delivery",
    },
    {
      city: "Ahmedabad",
      state: "Gujarat",
      port: "Mundra Port",
    },
  ];

  return (
    <section className="destinations" id="destinations">

      <div className="section-heading">
        <span>OUR NETWORK</span>
        <h2>From Russia to Your Doorstep</h2>
        <p>
          Import products from Russian suppliers
          with delivery coordination across India.
        </p>
      </div>

      <div className="route-box">
        <div className="route-country">
          <span>🇷🇺</span>
          <h3>Russia</h3>
          <p>Country of Origin</p>
        </div>

        <div className="route-line">
          <span>✈ 🚢</span>
          <div></div>
          <small>International Logistics</small>
        </div>

        <div className="route-country">
          <span>🇮🇳</span>
          <h3>India</h3>
          <p>Destination Country</p>
        </div>
      </div>

      <div className="destination-grid">

        {destinations.map((destination, index) => (
          <div className="destination-card" key={index}>

            <div className="destination-icon">
              📍
            </div>

            <h3>{destination.city}</h3>

            <p>{destination.state}</p>

            <span>{destination.port}</span>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Destinations;
