import Header from "./component/Header";
import heroImage from '../../products/hero.jpg'

const App = () => {
  return (
    <>
      <Header />
      <section className="text-slate-800">
        <div>
          <h1 className="text-center font-[700] text-[3rem]">Order Noodles Instantly!</h1>
        </div>
        <div>
          <img
            src={heroImage}
            alt="noodles"
            className="absolute object-contain h-[85%] top-[10rem]"
          />
        </div>
      </section>
    </>
  )
}

export default App