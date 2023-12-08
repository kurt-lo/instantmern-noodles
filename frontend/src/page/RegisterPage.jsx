import React, { useState } from 'react'
import axios from '../context/axiosConfig'
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/users/register', {
        name,
        email,
        password
      });

      if (response.status === 201) {
        setEmail('');
        setName('');
        setPassword('');
        alert('Register successful!')
        navigate('/login');
      } else {
        setEmail('');
        setName('');
        setPassword('');
        console.log('Register error!', response.data);
      }
    } catch (error) {
      setEmail('');
      setName('');
      setPassword('');
      console.error('Error during registration:', error)
    }
  };

  return (
    <section>
      <form onSubmit={handleRegister}>
        <input type="text" value={name} placeholder='Enter Name' onChange={(e) => setName(e.target.value)} />
        <input type="email" value={email} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </section>
  )
}

export default RegisterPage