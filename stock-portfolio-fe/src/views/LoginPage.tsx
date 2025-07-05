import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Alert, Typography } from "antd";
import { useStores } from "../stores/useStores";
import { runInAction } from "mobx";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { authStore } = useStores();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    runInAction(() => {
      authStore.error = null;
    });
    await authStore.login(values.email, values.password);
  };

  const onValuesChange = () => {
    if (authStore.error) {
      runInAction(() => {
        authStore.error = null;
      });
    }
  };

  useEffect(() => {
    if (authStore.token && !authStore.loading) {
      runInAction(() => {
        authStore.error = null;
      });
      navigate("/");
    }
  }, [authStore.token, authStore.loading, navigate]);

  useEffect(() => {
    if (authStore.error) {
      const timer = setTimeout(() => {
        runInAction(() => {
          authStore.error = null;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authStore.error]);

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <Title level={2}>Login</Title>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        layout="vertical"
      >
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        {authStore.error && (
          <Alert type="error" message={authStore.error} showIcon   style={{ marginBottom: 16 }}/>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={authStore.loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
};

export default observer(LoginPage);
