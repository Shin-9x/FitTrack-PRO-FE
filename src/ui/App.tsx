import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import HomePage from './pages/homepage/HomePage';
import { 
    getAccessToken, 
    getRefreshToken, 
    isAccessTokenExpired, 
    isRefreshTokenExpired 
} from './util/keyHelper';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkTokens = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      const accessExpired = isAccessTokenExpired();
      const refreshExpired = isRefreshTokenExpired();

      if (!accessToken || !refreshToken) {
        setRedirectPath('/login');
      } else if (accessExpired) {
        setRedirectPath('/login');
      } else if (refreshExpired) {
        setRedirectPath('/login');
      } else {
        setRedirectPath('/homepage');
      }

      setIsLoading(false);
    };

    checkTokens();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={redirectPath || '/login'} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;