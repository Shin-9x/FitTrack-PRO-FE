import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (!username || !password || !email) {
      setErrorMessage('Tutti i campi sono obbligatori.');
      return;
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage('La password deve avere almeno 8 caratteri alfanumerici.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Username already taken') {
          setErrorMessage('Questo username è già in uso.');
        } else if (errorData.message === 'Email already in use') {
          setErrorMessage('Questa email è già in uso.');
        } else {
          setErrorMessage('Errore durante la registrazione. Riprova.');
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Errore di connessione. Controlla la tua connessione e riprova.');
    }
  };

  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Registrazione</h1>

      <div className="form-group">
        <input
          placeholder='Email'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </div>

      <div className="form-group">
        <input
          placeholder='Username'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
      </div>

      <div className="form-group">
        <input
          placeholder='Password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button onClick={handleRegister} className="button">Conferma</button>
      Già registrato? Vai alla pagina di <p className='link' onClick={goToLoginPage}>Login</p>.
    </div>
  );
};

export default RegisterPage;