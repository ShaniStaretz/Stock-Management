import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useStores } from "../stores/useStores";
import { runInAction } from "mobx";

interface RegisterFormValues {
  email: string;
  password: string;
}

const RegisterPage: React.FC = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormValues) => {
    runInAction(() => {
      authStore.error = null;
    });
    await authStore.register(values.email, values.password);

    if (!authStore.error) {
      navigate("/login");
    }
  };

 

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
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
            {
              validator: (_, value) =>
                value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ? Promise.reject("Email format is invalid")
                  : Promise.resolve(),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {authStore.error && (
          <Alert type="error" message={authStore.error} showIcon style={{ marginBottom: 16 }}/>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={authStore.loading}
            
          >
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Button type="link" onClick={() => navigate("/login")}>
          Back to Login
        </Button>
      </div>
    </div>
  );
});

export default RegisterPage;
