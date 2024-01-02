import Footer from "./component/Footer";
import Header from "./component/Header";
import Hero from "./component/Hero";
import BestSeller from "./component/BestSeller"
import Rating from "./component/Rating";

const App = () => {

  return (
    <>
      <Header />
      <section className="text-slate-800">
        <Hero />
        <BestSeller />
        <Rating />
        <Footer />
      </section>
    </>
  )
}

export default App