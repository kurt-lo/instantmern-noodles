import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from '../context/axiosConfig'
// import axios from 'axios';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // const response = await fetch('/api/users/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // })

      const response = await axios.post('/api/users/login', {
        email,
        password,
      });

      const data = await response.data;
      if (data.token) {
        localStorage.setItem('authUserToken', data.token);
        // toast.success("Login successful!");
        console.log("Login successful!");
        setEmail('');
        setPassword('');
        navigate('/home');
      } else {
        setEmail('');
        setPassword('');
        toast.error('Invalid Email or Password!');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
    window.location.reload(true) //para marefresh yung header kasi hindi nagrerefresh e
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </section>
  );
};

export default LoginPage;