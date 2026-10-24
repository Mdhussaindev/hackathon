
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await login(values);
      message.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">H.</div>

          <h1>Build something extraordinary.</h1>

          <p>
            A modern workspace designed for powerful
            ideas and seamless experiences.
          </p>

          <div className="brand-footer">
            HACKATHON 2026 • FULL STACK EXPERIENCE
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <div className="mobile-logo">H.</div>

          <Text className="eyebrow">WELCOME BACK</Text>

          <Title level={2}>Sign in to your account</Title>

          <Text type="secondary">
            Enter your credentials to continue.
          </Text>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="auth-form"
            requiredMark={false}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="name@example.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Enter password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <div className="form-options">
              <Checkbox>Remember me</Checkbox>
              <Text type="secondary">Secure sign in</Text>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="auth-button"
            >
              Sign In <ArrowRightOutlined />
            </Button>
          </Form>

          <p className="auth-bottom">
            Don't have an account?{" "}
            <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
