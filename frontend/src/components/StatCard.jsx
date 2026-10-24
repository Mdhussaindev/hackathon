
import { Card, Typography } from "antd";

const { Text, Title } = Typography;

export default function StatCard({ title, value, icon, loading = false }) {
  return (
    <Card className="stat-card" loading={loading}>
      <div className="stat-top">
        <Text type="secondary">{title}</Text>
        <div className="stat-icon">{icon}</div>
      </div>

      <Title level={2} className="stat-value">
        {value ?? "—"}
      </Title>
    </Card>
  );
}
