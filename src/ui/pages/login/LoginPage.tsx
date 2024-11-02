/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../util/apiHelper';
import { saveAccessToken, saveRefreshToken } from '../../util/keyHelper' // Importa i metodi di salvataggio
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if (!username || !password) {
        setErrorMessage('Tutti i campi sono obbligatori.');
        return;
    }

    const { data, status, message } = await apiRequest<{ accessToken: { token: string; expiresAt: string }, refreshToken: { token: string; expiresAt: string } }>('/auth/login', 'POST', { username, password });

    if (status === 200) {
        console.log('Connessione riuscita!', data);
        // Salva i token ricevuti
        if(data) {
            await saveAccessToken(data.accessToken.token, new Date(data.accessToken.expiresAt).getTime());
            await saveRefreshToken(data.refreshToken.token, new Date(data.refreshToken.expiresAt).getTime());
        }
        
        navigate('/homepage');
    } else {
        switch (status) {
            case 400:
                setErrorMessage('Compilare correttamente tutti i campi.');
                break;
            case 404:
                setErrorMessage('L\'username inserito non è presente nei nostri sistemi.');
                break;
            case 401:
                setErrorMessage('La password inserita non è valida');
                break;
            case 500:
                setErrorMessage('Errore durante il login. Riprova');
                break;
            default:
                setErrorMessage(message || 'Errore sconosciuto.');
                break;
        }
    }
  };

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