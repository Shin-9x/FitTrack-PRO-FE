/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../util/apiHelper';
import { saveAccessToken, saveRefreshToken } from '../../util/keyHelper';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../components/toast/ToastType';
import { LOGIN_ENDPOINT } from '../../constants/beEndpoints';
import { HOME_PAGE_ENDPOINT, REGISTER_PAGE_ENDPOINT } from '../../constants/feEndpoints';

import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
        showToast('Tutti i campi sono obbligatori.', ToastType.ERROR, 3000);
        return;
    }

    const { data, status, message } = await apiRequest<{ accessToken: { token: string; expiresAt: string }, refreshToken: { token: string; expiresAt: string } }>(LOGIN_ENDPOINT, 'POST', { username, password });

    if (status === 200) {
        showToast('Successo!', ToastType.SUCCESS, 3000);

        if(data) {
            await saveAccessToken(data.accessToken.token, new Date(data.accessToken.expiresAt).getTime());
            await saveRefreshToken(data.refreshToken.token, new Date(data.refreshToken.expiresAt).getTime());
        }
        
        setTimeout(() => { navigate(HOME_PAGE_ENDPOINT); }, 3000);
    } else {
        switch (status) {
            case 400:
                showToast('Compilare correttamente tutti i campi.', ToastType.ERROR);
                break;
            case 404:
                showToast('L\'username inserito non è presente nei nostri sistemi.', ToastType.ERROR);
                break;
            case 401:
                showToast('La password inserita non è valida', ToastType.ERROR);
                break;
            case 500:
                showToast('Errore durante il login. Riprova', ToastType.ERROR);
                break;
            default:
                showToast(message || 'Errore sconosciuto.', ToastType.ERROR);
                break;
        }
    }
  };

  const goToRegisterPage = () => {
    navigate(REGISTER_PAGE_ENDPOINT);
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

      <button onClick={handleLogin} className="button">Conferma</button>
      Non sei registrato? Vai alla pagina di <p className='link' onClick={goToRegisterPage}>Registrazione</p>.
    </div>
  );
};

export default LoginPage;