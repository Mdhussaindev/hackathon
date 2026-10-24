
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  message,
  Spin,
} from "antd";

import {
  BankOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import api from "../../services/api";

const { Title, Text } = Typography;

export default function Setup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const { data } = await api.get("/setup/status");

        if (data.initialized) {
          navigate("/login", { replace: true });
        }
      } catch {
        message.error("Cannot connect to setup service");
      } finally {
        setChecking(false);
      }
    };

    checkSetup();
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await api.post("/setup/initialize", {
        companyName: values.companyName,
        officeStart: values.officeStart,
        graceMinutes: values.graceMinutes,
        adminName: values.adminName,
        adminEmail: values.adminEmail,
        adminPassword: values.adminPassword,
      });

      message.success("Company created successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      message.error(
        error.response?.data?.message || "Setup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="page-loader"><Spin size="large" /></div>;
  }

  return (
    <div className="setup-page">
      <div className="setup-wrapper">
        <div className="setup-header">
          <div className="setup-logo">HCM.</div>
          <Text className="section-label">GETTING STARTED</Text>
          <Title level={2}>Set up your organization</Title>
          <Text type="secondary">
            Create your company workspace and administrator account.
          </Text>
        </div>

        <Card className="setup-card">
          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{
              officeStart: "09:00",
              graceMinutes: 15,
            }}
          >
            <div className="form-section-heading">
              <BankOutlined />
              <span>Company Information</span>
            </div>

            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, min: 2 }]}
            >
              <Input size="large" placeholder="Enter company name" />
            </Form.Item>

            <div className="form-grid">
              <Form.Item
                name="officeStart"
                label="Office Start Time (HH:mm)"
                rules={[
                  { required: true },
                  { pattern: /^([01]\d|2[0-3]):[0-5]\d$/, message: "Use HH:mm format" },
                ]}
              >
                <Input size="large" placeholder="09:00" />
              </Form.Item>

              <Form.Item
                name="graceMinutes"
                label="Grace Period (minutes)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={120} size="large" style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="form-section-heading">
              <UserOutlined />
              <span>Administrator Account</span>
            </div>

            <Form.Item
              name="adminName"
              label="Full Name"
              rules={[{ required: true, min: 2 }]}
            >
              <Input size="large" prefix={<UserOutlined />} placeholder="Administrator name" />
            </Form.Item>

            <Form.Item
              name="adminEmail"
              label="Email Address"
              rules={[{ required: true, type: "email" }]}
            >
              <Input size="large" prefix={<MailOutlined />} placeholder="admin@company.com" />
            </Form.Item>

            <Form.Item
              name="adminPassword"
              label="Password"
              rules={[{ required: true, min: 8 }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Minimum 8 characters" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["adminPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value === getFieldValue("adminPassword"))
                      return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Confirm password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="primary-action"
            >
              Create Workspace <ArrowRightOutlined />
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
