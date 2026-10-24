
import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Alert, Button } from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import StatCard from "../../components/StatCard";
import api from "../../services/api";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/dashboard/admin");
      setData(response.data);
    } catch {
      setError("Unable to load company statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <Text className="section-label">ADMIN WORKSPACE</Text>
          <Title level={2}>Company Overview</Title>
          <Text type="secondary">
            Your organization at a glance.
          </Text>
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
          ["Total Employees", data?.headcount, <TeamOutlined />],
          ["Payroll Cost", data?.payrollCost == null ? null : `Rs. ${data.payrollCost.toLocaleString()}`, <DollarOutlined />],
          ["Average Salary", data?.averageSalary == null ? null : `Rs. ${data.averageSalary.toLocaleString()}`, <UserOutlined />],
          ["Attrition YTD", data?.attritionYTD == null ? null : `${data.attritionYTD}%`, <BarChartOutlined />],
        ].map(([title, value, icon]) => (
          <Col xs={24} sm={12} xl={6} key={title}>
            <StatCard title={title} value={value} icon={icon} loading={loading} />
          </Col>
        ))}
      </Row>

      <Card title="Company Insights" className="content-card">
        <Text type="secondary">
          {loading ? "Loading..." : error ? "Data unavailable." : "Company metrics are loaded from your database."}
        </Text>
      </Card>
    </div>
  );
}
