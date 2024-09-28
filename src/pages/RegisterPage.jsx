import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "antd";
import "../css/Register.css";

const RegisterPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="register-container">
      <div className="register-bg" />
      <div className="register-form">
        <h2>Register</h2>
        <Form
          form={form}
          name="register"
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
            <Button htmlType="submit" className="register-button" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="additional-links">
          <div className="register-link">
            Already have an account? <Link to={"/login"}>Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
