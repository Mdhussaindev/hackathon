
import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Button, message, Alert } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import api from "../../services/api";

const { Title, Text } = Typography;

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/dashboard/employee");
      setData(data);
    } catch {
      setError("Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const attendanceAction = async (action) => {
    setActionLoading(true);

    try {
      const { data } = await api.post(`/attendance/${action}`);
      message.success(data.message || "Attendance updated");
      await loadDashboard();
    } catch (error) {
      message.error(error.response?.data?.message || "Request failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <Text className="section-label">MY WORKSPACE</Text>
          <Title level={2}>Welcome, {user?.name} 👋</Title>
          <Text type="secondary">Your personal HR dashboard.</Text>
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
          ["Hours This Week", data?.hoursThisWeek, <ClockCircleOutlined />],
          ["Leave Balance", data?.leaveBalance, <CalendarOutlined />],
          ["Late Count", data?.lateCount, <CheckCircleOutlined />],
          ["Last Payslip", data?.lastPayslip == null ? null : `Rs. ${data.lastPayslip.toLocaleString()}`, <DollarOutlined />],
        ].map(([title, value, icon]) => (
          <Col xs={24} sm={12} xl={6} key={title}>
            <StatCard title={title} value={value} icon={icon} loading={loading} />
          </Col>
        ))}
      </Row>

      <Card title="Today's Attendance" className="content-card">
        <Text type="secondary">
          Mark your attendance for today.
        </Text>

        <div className="attendance-actions">
          <Button
            type="primary"
            size="large"
            loading={actionLoading}
            disabled={loading || !!error || !!data?.checkedIn}
            onClick={() => attendanceAction("check-in")}
          >
            Check In
          </Button>

          <Button
            size="large"
            loading={actionLoading}
            disabled={loading || !!error || !data?.checkedIn || !!data?.checkedOut}
            onClick={() => attendanceAction("check-out")}
          >
            Check Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
