import Footer from "./component/Footer";
import Header from "./component/Header";
import Hero from "./component/Hero";

const App = () => {

  return (
    <>
      <Header />
      <section className="text-slate-800">
        <Hero />
        <Footer />
      </section>
    </>
  )
}

export default App