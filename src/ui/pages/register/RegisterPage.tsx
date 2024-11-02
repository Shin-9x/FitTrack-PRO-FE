import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../util/apiHelper';
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

    const { status, errorCode, message } = await apiRequest('/auth/register', 'POST', { username, password, email });

    if (status === 200) {
        navigate('/login');
    } else {
        if (status === 400) {
            setErrorMessage('Compilare correttamente tutti i campi.');
        } else if (status === 409) {
            if (errorCode === 'ERR001') {
                setErrorMessage('Questo username è già in uso.');
            } else if (errorCode === 'ERR002') {
                setErrorMessage('Questa email è già in uso.');
            } else {
                setErrorMessage(message || 'Errore durante la registrazione. Riprova.');
            }
        } else {
            setErrorMessage(message || 'Errore durante la registrazione. Riprova.');
        }
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