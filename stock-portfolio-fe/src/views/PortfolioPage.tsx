import React from 'react';
import { Row, Col } from 'antd';
import StockSearchPanel from '../components/StockSearchPanel';
import PortfolioPanel from '../components/PortfolioPanel';

const PortfolioPage: React.FC = () => {
  return (
    <Row gutter={32} style={{ padding: 20,overflowX: "hidden"}}>
      <Col xs={24} md={12}>
        <StockSearchPanel />
      </Col>
      <Col xs={24} md={12}>
        <PortfolioPanel />
      </Col>
    </Row>
  );
};

export default PortfolioPage;