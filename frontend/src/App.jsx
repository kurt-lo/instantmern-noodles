import Header from "./component/Header";
import Hero from "./component/Hero";

const App = () => {

  return (
    <>
      <Header />
      <section className="text-slate-800 w-100% sm:w-[90%] mx-auto">
        <Hero />
      </section>
    </>
  )
}

export default App