import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../util/apiHelper';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../components/toast/ToastType';

import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !email) {
        showToast('Tutti i campi sono obbligatori.', ToastType.ERROR, 3000);
        return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('La mail non è in un formato valido.', ToastType.ERROR, 3000);
      return;
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        showToast('La password deve avere almeno 8 caratteri alfanumerici.', ToastType.ERROR, 3000);
        return;
    }

    const { status, errorCode, message } = await apiRequest('/auth/register', 'POST', { username, password, email });

    if (status === 200) {
        showToast('Registrazione avvenuta con successo!', ToastType.SUCCESS, 3000);
        setTimeout(() => {
          goToLoginPage();
        }, 3000);
    } else {
        if (status === 400) {
            showToast('Compilare correttamente tutti i campi.', ToastType.ERROR);
        } else if (status === 409) {
            if (errorCode === 'ERR001') {
                showToast('Questo username è già in uso.', ToastType.ERROR);
            } else if (errorCode === 'ERR002') {
                showToast('Questa email è già in uso.', ToastType.ERROR);
            } else {
                showToast(message || 'Errore durante la registrazione. Riprova.', ToastType.ERROR);
            }
        } else {
            showToast(message || 'Errore durante la registrazione. Riprova.', ToastType.ERROR);
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

      <button onClick={handleRegister} className="button">Conferma</button>
      Già registrato? Vai alla pagina di <p className='link' onClick={goToLoginPage}>Login</p>.
    </div>
  );
};

export default RegisterPage;