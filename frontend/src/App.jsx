import { Link } from "react-router-dom";

const App = () => {
  return (
    <section className="pt-[3rem]">
      <ul className="flex">
        <li>
          <Link to='/login' className=" px-[3rem] py-[1rem] bg-slate-400 rounded-[25px]">Login</Link>
        </li>
        <li>
          <Link to='/register' className=" px-[3rem] py-[1rem] bg-slate-400 rounded-[25px]">Register</Link>
        </li>
      </ul>
    </section>
  )
}

export default App