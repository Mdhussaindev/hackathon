
import { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  UserOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menus = {
  admin: [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Overview" },
    { key: "/admin/company", icon: <SettingOutlined />, label: "Company Setup" },
    { key: "/admin/departments", icon: <TeamOutlined />, label: "Departments" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Manage Users" },
    { key: "/admin/audit", icon: <AuditOutlined />, label: "Audit Logs" },
  ],
  hr: [
    { key: "/hr/dashboard", icon: <DashboardOutlined />, label: "Overview" },
    { key: "/hr/employees", icon: <TeamOutlined />, label: "Employees" },
    { key: "/hr/attendance", icon: <ClockCircleOutlined />, label: "Attendance" },
    { key: "/hr/leaves", icon: <CalendarOutlined />, label: "Leave Approvals" },
    { key: "/hr/payroll", icon: <DollarOutlined />, label: "Payroll" },
  ],
  employee: [
    { key: "/employee/dashboard", icon: <DashboardOutlined />, label: "Overview" },
    { key: "/employee/attendance", icon: <ClockCircleOutlined />, label: "My Attendance" },
    { key: "/employee/leaves", icon: <CalendarOutlined />, label: "My Leaves" },
    { key: "/employee/payslips", icon: <DollarOutlined />, label: "My Payslips" },
  ],
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const accountMenu = {
    items: [
      {
        key: "role",
        label: `Role: ${user?.role?.toUpperCase()}`,
        disabled: true,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Sign Out",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className="dashboard-shell">
      <Sider
        className="dashboard-sider"
        theme="dark"
        width={250}
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={0}
        onCollapse={setCollapsed}
      >
        <div className="sidebar-brand">
          {collapsed ? "H." : "HCM Lite."}
        </div>

        <div className="sidebar-caption">WORKSPACE</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menus[user?.role] || []}
          onClick={({ key }) => navigate(key)}
        />

        <div className="sidebar-bottom">
          <RobotOutlined /> Smart HR Workspace
        </div>
      </Sider>

      <Layout>
        <Header className="dashboard-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Text strong>Human Capital Management</Text>
          </div>

          <Dropdown menu={accountMenu} placement="bottomRight">
            <div className="account-trigger">
              <Avatar style={{ background: "#2563eb" }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <span className="account-name">{user?.name}</span>
            </div>
          </Dropdown>
        </Header>

        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
