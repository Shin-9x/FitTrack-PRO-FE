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
import { 
  LOGIN_PAGE_ENDPOINT,
  REGISTER_PAGE_ENDPOINT,
  HOME_PAGE_ENDPOINT
} from './constants/feEndpoints';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkTokens = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      const accessExpired = await isAccessTokenExpired();
      const refreshExpired = await isRefreshTokenExpired();

      if (!accessToken || !refreshToken) {
        setRedirectPath(LOGIN_PAGE_ENDPOINT);
      } else if (accessExpired) {
        setRedirectPath(LOGIN_PAGE_ENDPOINT);
      } else if (refreshExpired) {
        setRedirectPath(LOGIN_PAGE_ENDPOINT);
      } else {
        setRedirectPath(HOME_PAGE_ENDPOINT);
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
        <Route path="/" element={<Navigate to={redirectPath || LOGIN_PAGE_ENDPOINT} />} />
        <Route path={LOGIN_PAGE_ENDPOINT} element={<LoginPage />} />
        <Route path={REGISTER_PAGE_ENDPOINT} element={<RegisterPage />} />
        <Route path={HOME_PAGE_ENDPOINT} element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;