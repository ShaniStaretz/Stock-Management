// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PortfolioPage from './views/PortfolioPage';
import StockDetailPage from './views/StockDetailsPage';
import LoginPage from './views/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useStores } from './stores/useStores';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const { authStore } = useStores();

  useEffect(() => {
    authStore.fetchUser();
  }, [authStore]);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ color: 'white', fontSize: 20 }}>
          📊 Stock Manager
        </Header>
        <Content style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock/:symbol"
              element={
                <ProtectedRoute>
                  <StockDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
