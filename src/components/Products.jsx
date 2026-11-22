
const products = [
  {
    icon: "🛢️",
    title: "Oil & Energy",
    description: "Explore sourcing opportunities for energy-related products."
  },
  {
    icon: "🌾",
    title: "Agricultural Products",
    description: "Explore grains, fertilizers and agricultural commodities."
  },
  {
    icon: "⚙️",
    title: "Industrial Materials",
    description: "Explore industrial raw materials and manufacturing supplies."
  },
  {
    icon: "🧪",
    title: "Chemicals",
    description: "Explore industrial and specialty chemical sourcing."
  },
  {
    icon: "🔩",
    title: "Metals & Minerals",
    description: "Explore metal products and mineral commodities."
  },
  {
    icon: "🏭",
    title: "Machinery",
    description: "Explore industrial machinery and equipment."
  }
];

function Products() {
  return (
    <section className="products" id="products">
      <div className="section-heading">
        <span className="section-tag">PRODUCT CATEGORIES</span>
        <h2>What are you looking to <span>import?</span></h2>
        <p>
          Explore product categories and tell us what your business needs.
        </p>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="product-icon">{product.icon}</div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <a href="#contact">Explore category →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
