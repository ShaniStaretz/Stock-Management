import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useStores } from '../stores/useStores';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const { authStore } = useStores();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    await authStore.login(values.email, values.password);
    if (authStore.token) {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Title level={2}>Login</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}> 
          <Input.Password />
        </Form.Item>
        {authStore.error && <Alert type="error" message={authStore.error} showIcon />}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={authStore.loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default observer(LoginPage);