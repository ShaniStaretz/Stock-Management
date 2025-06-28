import { Descriptions } from "antd";

export const StockMainStats: React.FC<{
  dayLow?: number | null;
  dayHigh?: number | null;
  yearLow?: number | null;
  yearHigh?: number | null;
  open?: number | null;
  previousClose?: number | null;
  volume?: number | null;
  avgVolume?: number | null;
  marketCap?: number | null;
  beta?: number | null;
  pe?: number | null;
  eps?: number | null;
  lastDiv?: number | null;
  sharesOutstanding?: number | null;
}> = (props) => (
  <Descriptions bordered column={2} size="small">
    <Descriptions.Item label="Day Range">
      $
      {props.dayLow !== undefined && props.dayLow !== null
        ? props.dayLow
        : "N/A"}{" "}
      - $
      {props.dayHigh !== undefined && props.dayHigh !== null
        ? props.dayHigh
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="52w Range">
      $
      {props.yearLow !== undefined && props.yearLow !== null
        ? props.yearLow
        : "N/A"}{" "}
      - $
      {props.yearHigh !== undefined && props.yearHigh !== null
        ? props.yearHigh
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Open">
      ${props.open !== undefined && props.open !== null ? props.open : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Previous Close">
      $
      {props.previousClose !== undefined && props.previousClose !== null
        ? props.previousClose
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Volume">
      {props.volume !== undefined && props.volume !== null
        ? props.volume.toLocaleString()
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Avg Volume">
      {props.avgVolume !== undefined && props.avgVolume !== null
        ? props.avgVolume.toLocaleString()
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Market Cap">
      {props.marketCap !== undefined && props.marketCap !== null
        ? `$${(props.marketCap / 1e9).toFixed(2)}B`
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Beta">
      {props.beta !== undefined && props.beta !== null ? props.beta : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="P/E Ratio">
      {props.pe !== undefined && props.pe !== null ? props.pe : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="EPS">
      {props.eps !== undefined && props.eps !== null ? `$${props.eps}` : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Dividend">
      {props.lastDiv !== undefined && props.lastDiv !== null
        ? `$${props.lastDiv}`
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Outstanding Shares">
      {props.sharesOutstanding !== undefined && props.sharesOutstanding !== null
        ? props.sharesOutstanding.toLocaleString()
        : "N/A"}
    </Descriptions.Item>
  </Descriptions>
);
