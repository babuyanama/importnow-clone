
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destinations from "./components/Destinations";
import Services from "./components/Services";
import Process from "./components/Process";
import Products from "./components/Products";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Admin from "./components/Admin";

import "./App.css";
// import Destinations from "./components/Destinations";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Destinations/>
      <Services/>
      <Process/>
      <Products/>
      <Contact/>
      <Footer/>
      <Admin/>
    </>
  );
}

export default App;
