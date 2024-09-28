import { Button, Form, Input } from "antd";
// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [form] = Form.useForm();

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>Login</h2>
        <Form
          form={form}
          name="login"
          // onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "Username can only contain letters and numbers!",
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="login-button" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div className="additional-links">
          <div className="register-link">
            Don't have an account? <Link to={"/register"}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
