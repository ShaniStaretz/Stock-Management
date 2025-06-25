import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PortfolioPage from './views/PortfolioPage';
import StockDetailsPage from './views/StockDetailsPage';

const { Header, Content } = Layout;

const App = () => (
  <Router>
    <Layout>
      <Header style={{ color: 'white', fontSize: 20 }}>📊 Stock Manager</Header>
      <Content style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/stock/:symbol" element={<StockDetailsPage />} />
        </Routes>
      </Content>
    </Layout>
  </Router>
);

export default App;