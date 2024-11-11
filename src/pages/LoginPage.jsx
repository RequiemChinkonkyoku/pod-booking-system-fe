import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/Login.css";

const LoginPage = () => {
  const [form] = Form.useForm();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (isLoggedIn && user) {
      if (mounted) {
        if (user.role === "4") {
          message.success("Login successful");
          navigate("/admin/users");
        } else if (user.role === "1") {
          message.success("Login successful");
          navigate("/customer/dashboard");
        } else if (user.role === "2") {
          message.success("Login successful");
          navigate("/staff/dashboard");
        } else if (user.role === "3") {
          message.success("Login successful");
          navigate("/manager/dashboard");
        }
        setIsLoggedIn(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        setIsLoggedIn(true);
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>Login</h2>
        <Spin spinning={loading}>
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
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
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                block
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
          <div className="additional-links">
            <div className="register-link">
              Don't have an account? <Link to={"/register"}>Sign up</Link>
            </div>
          </div>
          <div className="additional-links">
            <div className="register-link">
              Forget password?{" "}
              <Link to={"/forgetPassword"}>Reset password here</Link>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LoginPage;
