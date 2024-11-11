import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/Login.css";

import axios from "../utils/axiosConfig";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForget = async (values) => {
    const { email } = values;
    setLoading(true);
    try {
      const success = await axios.post(`/Auth/Password/Forget?email=${email}`);
      if (success) {
        // setIsLoggedIn(true);
      } else {
        // message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      //   console.error("Login error:", error);
      //   message.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>Forget Password</h2>
        <Spin spinning={loading}>
          <Form
            form={form}
            name="login"
            onFinish={handleForget}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                block
                loading={loading}
              >
                Send OTP to this email
              </Button>
            </Form.Item>
          </Form>
          <div className="additional-links">
            <div className="register-link">
              Accidentally remember password? <Link to={"/login"}>Login</Link>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default ForgetPassword;
