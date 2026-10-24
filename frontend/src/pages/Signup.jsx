
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      message.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-logo">H.</div>
          <h1>Your journey starts here.</h1>
          <p>Create your account and start building something amazing.</p>
          <div className="brand-footer">HACKATHON 2026 • FULL STACK EXPERIENCE</div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <div className="mobile-logo">H.</div>
          <Text className="eyebrow">GET STARTED</Text>
          <Title level={2}>Create your account</Title>
          <Text type="secondary">Fill in your details to get started.</Text>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="auth-form"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, min: 2 }]}
            >
              <Input prefix={<UserOutlined />} size="large" placeholder="Your full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: "email" }]}
            >
              <Input prefix={<MailOutlined />} size="large" placeholder="name@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 8, message: "Minimum 8 characters" }]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" placeholder="Create password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" placeholder="Confirm password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="auth-button">
              Create Account <ArrowRightOutlined />
            </Button>
          </Form>

          <p className="auth-bottom">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
