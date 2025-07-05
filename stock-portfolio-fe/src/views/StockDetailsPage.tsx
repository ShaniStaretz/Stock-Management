import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Divider, Spin, Alert } from "antd";
import { StockHeader } from "../components/StockDetails/StockDetailsHeader";
import { StockMainStats } from "../components/StockDetails/StockMainStats";
import { StockCompanyInfo } from "../components/StockDetails/StockCompanyInfo";
import { StockUpComingInfo } from "../components/StockDetails/StockUpcomingInfo";
import { StockAboutSection } from "../components/StockDetails/StockAboutSection";
import { StockPriceInfo } from "../components/StockDetails/StockPriceInfo";
import { useStockDetails } from "../hooks/useStockDetails";

const StockDetailsPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { stock, loading, error } = useStockDetails(symbol);
  const navigate = useNavigate();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <Spin tip="Loading stock data..." />
      </div>
    );
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
  if (!stock) return null;

  const {
    name,
    price,
    changesPercentage,
    changes,
    marketCap,
    sector,
    industry,
    exchange,
    currency,
    image,
    dayLow,
    dayHigh,
    yearLow,
    yearHigh,
    previousClose,
    open,
    volume,
    avgVolume,
    beta,
    pe,
    eps,
    lastDiv,
    sharesOutstanding,
    ceo,
    fullTimeEmployees,
    ipoDate,
    address,
    city,
    state,
    zip,
    website,
    earningsAnnouncement,
    description,
    symbol: stockSymbol,
  } = stock;

  return (
    <Card style={{ margin: 20 }}>
      <button
        style={{
          marginBottom: 16,
          padding: "6px 16px",
          borderRadius: 4,
          border: "1px solid #d9d9d9",
          background: "#fff",
          cursor: "pointer",
        }}
        aria-label="Back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <Row gutter={[16, 16]}>
        <StockHeader
          image={image}
          name={name}
          symbol={stockSymbol || symbol}
          exchange={exchange}
          currency={currency}
        />

        <Col span={18}>
          <StockPriceInfo
            price={price}
            changes={changes}
            changesPercentage={changesPercentage}
          />
          <StockMainStats
            dayLow={dayLow}
            dayHigh={dayHigh}
            yearLow={yearLow}
            yearHigh={yearHigh}
            open={open}
            previousClose={previousClose}
            volume={volume}
            avgVolume={avgVolume}
            marketCap={marketCap}
            beta={beta}
            pe={pe}
            eps={eps}
            lastDiv={lastDiv}
            sharesOutstanding={sharesOutstanding}
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <StockCompanyInfo
            ceo={ceo}
            fullTimeEmployees={
              fullTimeEmployees === null ? undefined : fullTimeEmployees
            }
            ipoDate={ipoDate}
            sector={sector}
            industry={industry}
            address={address}
            city={city}
            state={state}
            zip={zip}
            website={website}
          />
        </Col>

        <Col span={12}>
          <StockUpComingInfo earningsAnnouncement={earningsAnnouncement} />
          <StockAboutSection description={description} />
        </Col>
      </Row>
    </Card>
  );
};

export default StockDetailsPage;
