

import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Alert, Button } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import StatCard from "../../components/StatCard";
import api from "../../services/api";

const { Title, Text } = Typography;

export default function HRDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/dashboard/hr");
      setData(data);
    } catch {
      setError("Unable to load HR statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <Text className="section-label">PEOPLE OPERATIONS</Text>
          <Title level={2}>HR Dashboard</Title>
          <Text type="secondary">Manage your people and daily operations.</Text>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          title={error}
          action={<Button size="small" onClick={loadDashboard}>Retry</Button>}
          style={{ marginBottom: 20 }}
        />
      )}

      <Row gutter={[20, 20]}>
        {[
          ["Headcount", data?.headcount, <TeamOutlined />],
          ["Present Today", data?.presentToday, <CheckCircleOutlined />],
          ["On Leave", data?.onLeaveToday, <CalendarOutlined />],
          ["Pending Approvals", data?.pendingApprovals, <ClockCircleOutlined />],
        ].map(([title, value, icon]) => (
          <Col xs={24} sm={12} xl={6} key={title}>
            <StatCard title={title} value={value} icon={icon} loading={loading} />
          </Col>
        ))}
      </Row>

      <Card title="People Operations" className="content-card">
        <Text type="secondary">
          {loading ? "Loading..." : error ? "Data unavailable." : "Statistics reflect employee activity stored in the system."}
        </Text>
      </Card>
    </div>
  );
}
