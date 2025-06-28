import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button, Layout, Spin } from "antd";
import PortfolioPage from "./views/PortfolioPage";
import StockDetailsPage from "./views/StockDetailsPage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useStores } from "./stores/useStores";
import apiClient from "./api/apiClient";
const { Header, Content } = Layout;

const App: React.FC = observer(() => {
  const { authStore } = useStores();

  useEffect(() => {
    authStore.fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {
      // Ignore errors, since logout is stateless with JWT
    }
    authStore.logout();
    // Optionally, redirect to login
    window.location.href = "/login";
  };
  if (authStore.loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Loading user...">
          <div style={{ width: 100, height: 40 }} />
        </Spin>
      </div>
    );
  }
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            color: "white",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>📊 Stock Manager</span>
          {authStore.user && (
            <Button onClick={handleLogout} type="primary" danger>
              Logout
            </Button>
          )}
        </Header>

        <Content style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
                  <StockDetailsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
});

export default App;
