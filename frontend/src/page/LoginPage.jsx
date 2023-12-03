import { useState } from "react";

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    setUsername('');
    setPassword('');
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} placeholder='Enter Username' onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" value={password} placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Login</button>
      </form>
    </section>
  );
};

export default LoginPage;