import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import LoginPage from './page/LoginPage.jsx';
import RegisterPage from './page/RegisterPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App />}/>
        <Route path='login' element={ <LoginPage />}/>
        <Route path='register' element={ <RegisterPage />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
