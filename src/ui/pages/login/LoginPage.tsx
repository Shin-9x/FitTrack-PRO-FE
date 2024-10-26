import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if(!username || !password) {
        setErrorMessage('Tutti i campi sono obbligatori.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password}),
        });

        if(response.ok) {
            console.log('Connessione riuscita!');
        } else {
            const errorData = await response.json();
            if(errorData.message === 'Username not recognized') {
                setErrorMessage('L\'username inserito non è presente nei nostri sistemi.');
            } else if(errorData.message === 'Password not recognized') {
                setErrorMessage('La password inserita non è valida');
            } else {
                setErrorMessage('Errore durante il login. Riprova');
            }
        }
    } catch(error) {
        console.log(error);
        setErrorMessage('Errore di connessione. Controlla la tua connessione e riprova.');
    }
  }

  const goToRegisterPage = () => {
    navigate('/registration');
  };

  return (
    <div className="container">
      <h1>Login</h1>

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

      <button onClick={handleLogin} className="button">Conferma</button>
      Non sei registrato? Vai alla pagina di <p className='link' onClick={goToRegisterPage}>Registrazione</p>.
    </div>
  );
};

export default LoginPage;