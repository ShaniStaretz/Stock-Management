import { Descriptions } from "antd";

export const StockUpComingInfo: React.FC<{
  earningsAnnouncement?: string;
}> = ({ earningsAnnouncement }) => (
  <Descriptions title="Upcoming" bordered column={1} size="small">
    <Descriptions.Item label="Next Earnings">
      {earningsAnnouncement
        ? new Date(earningsAnnouncement).toLocaleString()
        : "N/A"}
    </Descriptions.Item>
  </Descriptions>
);
