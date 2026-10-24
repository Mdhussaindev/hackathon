
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const { Title, Text } = Typography;

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password updated. Please sign in again.");
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      message.error(error.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <Card className="password-card">
        <Text className="section-label">ACCOUNT SECURITY</Text>
        <Title level={3}>Change your password</Title>
        <Text type="secondary">
          {user?.mustChangePassword
            ? "You must change your temporary password before continuing."
            : "Update your account password."}
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 28 }}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return value === getFieldValue("newPassword")
                    ? Promise.resolve()
                    : Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block size="large" className="primary-action">
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
}
