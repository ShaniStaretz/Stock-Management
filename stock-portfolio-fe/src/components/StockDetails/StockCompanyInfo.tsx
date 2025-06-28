import { Descriptions, Typography } from "antd";

const { Link } = Typography;

export const StockCompanyInfo: React.FC<{
  ceo?: string;
  fullTimeEmployees?: number;
  ipoDate?: string;
  sector?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
}> = ({
  ceo,
  fullTimeEmployees,
  ipoDate,
  sector,
  industry,
  address,
  city,
  state,
  zip,
  website,
}) => (
  <Descriptions title="Company Info" bordered column={1} size="small">
    <Descriptions.Item label="CEO">{ceo || "N/A"}</Descriptions.Item>
    <Descriptions.Item label="Employees">
      {fullTimeEmployees !== undefined && fullTimeEmployees !== null
        ? fullTimeEmployees
        : "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="IPO Date">{ipoDate || "N/A"}</Descriptions.Item>
    <Descriptions.Item label="Sector">{sector || "N/A"}</Descriptions.Item>
    <Descriptions.Item label="Industry">{industry || "N/A"}</Descriptions.Item>
    <Descriptions.Item label="Address">
      {[address, city, state, zip].filter(Boolean).join(", ") || "N/A"}
    </Descriptions.Item>
    <Descriptions.Item label="Website">
      {website ? (
        <Link href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </Link>
      ) : (
        "N/A"
      )}
    </Descriptions.Item>
  </Descriptions>
);
