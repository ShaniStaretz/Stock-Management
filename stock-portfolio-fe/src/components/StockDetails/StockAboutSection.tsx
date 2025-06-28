import { Typography, Divider } from "antd";

const { Paragraph } = Typography;

export const StockAboutSection: React.FC<{ description?: string }> = ({
  description,
}) => (
  <>
    <Divider orientation="left">About</Divider>
    <Paragraph ellipsis={{ rows: 6, expandable: true, symbol: "more" }}>
      {description || "No description available."}
    </Paragraph>
  </>
);
