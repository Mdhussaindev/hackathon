
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../context/AuthContext";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const user = await login(values);

      message.success("Welcome back!");

      if (user.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand-logo">HCM<span>.</span></div>

          <div>
            <div className="auth-pill">HUMAN CAPITAL MANAGEMENT</div>
            <h1>People first.<br />Everything connected.</h1>
            <p>
              One intelligent workspace for your people,
              attendance, leave and payroll.
            </p>
          </div>

          <div className="auth-visual-footer">
            © 2026 HCM Lite · Saylani Hackathon
          </div>
        </div>
      </section>

      <section className="auth-content">
        <div className="auth-box">
          <div className="auth-mobile-brand">HCM.</div>

          <div className="auth-heading">
            <Text className="section-label">WELCOME BACK</Text>
            <Title level={2}>Sign in to HCM Lite</Title>
            <Text type="secondary">
              Enter your credentials to access your workspace.
            </Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="auth-form"
          >
            <Form.Item
              label="Work Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@company.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="primary-action"
            >
              Sign In <ArrowRightOutlined />
            </Button>
          </Form>

          <div className="auth-security">
            <SafetyCertificateOutlined />
            <span>Secure role-based access</span>
          </div>

          <div className="auth-help">
            New company? <Link to="/setup">First-time setup</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
