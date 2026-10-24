
import { Layout, Menu, Card, Row, Col, Button, Typography, Avatar, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <div style={{
          color: "white", padding: 24,
          fontSize: 23, fontWeight: 800
        }}>
          H. Workspace
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "2", icon: <AppstoreOutlined />, label: "Projects" },
            { key: "3", icon: <UserOutlined />, label: "Profile" },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Text strong>Hackathon Dashboard</Text>

          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text>{user?.name}</Text>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>
          <Title level={2}>Welcome back, {user?.name} 👋</Title>
          <Text type="secondary">
            Here's an overview of your workspace.
          </Text>

          <Row gutter={[20, 20]} style={{ marginTop: 30 }}>
            {[
              ["Total Projects", "00"],
              ["Active Tasks", "00"],
              ["Completed Tasks", "00"],
              ["Team Members", "01"]
            ].map(([label, value]) => (
              <Col xs={24} sm={12} lg={6} key={label}>
                <Card style={{ borderRadius: 14 }}>
                  <Text type="secondary">{label}</Text>
                  <Title level={2} style={{ marginBottom: 0 }}>
                    {value}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>

          <Card
            title="Project Overview"
            style={{ marginTop: 25, borderRadius: 14 }}
          >
            <Text type="secondary">
              Your workspace is ready. Add modules based on
              your hackathon requirements.
            </Text>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
