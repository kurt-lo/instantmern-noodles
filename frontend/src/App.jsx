import Header from "./component/Header";
import heroImage from '../../products/hero.jpg'

const App = () => {
  return (
    <>
      <Header />
      <section>
        <div>
          <img
            src={heroImage}
            alt="noodles"
            className="object-contain h-[100vh]"
          />
        </div>
      </section>
    </>
  )
}

export default App