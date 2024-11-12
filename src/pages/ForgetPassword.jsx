import React, { useState } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import axios from "../utils/axiosConfig";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");

  const handleRequestOTP = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/Auth/Password/Forget", null, {
        params: {
          email: values.email,
        },
      });

      if (response.data) {
        message.success("OTP has been sent to your email!");
        setEmail(values.email);
        setShowOtpForm(true);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error("Invalid email or user not found");
      } else {
        message.error(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put("/Auth/Password/Forget", null, {
        params: {
          email: email,
          otpCode: values.otp,
          newPassword: values.newPassword,
        },
      });

      if (response.data) {
        message.success("Password has been reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errors = error.response?.data?.errors;
        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            messages.forEach((msg) => message.error(msg));
          });
        } else {
          message.error("Invalid OTP or request");
        }
      } else {
        message.error(
          error.response?.data?.message ||
            "Failed to reset password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const EmailForm = () => (
    <Form
      form={form}
      name="requestOTP"
      onFinish={handleRequestOTP}
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
        <Input placeholder="Email" className="ant-input-outlined" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-button"
          loading={loading}
        >
          Send OTP
        </Button>
      </Form.Item>
    </Form>
  );

  const OTPForm = () => (
    <Form
      form={form}
      name="resetPassword"
      onFinish={handleResetPassword}
      layout="vertical"
    >
      <div className="otp-subtitle">
        We've sent a verification code to {email}
      </div>

      <Form.Item
        name="otp"
        rules={[
          {
            required: true,
            message: "Please input the OTP!",
          },
          {
            pattern: /^[A-Z0-9]{7}$/,
            message: "Please enter a valid 7-character OTP code!",
          },
        ]}
      >
        <Input
          placeholder="Enter OTP code"
          className="ant-input-outlined"
          maxLength={7}
          style={{ textTransform: "uppercase" }}
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[
          {
            required: true,
            message: "Please input your new password!",
          },
          {
            min: 6,
            message: "Password must be at least 6 characters!",
          },
        ]}
      >
        <Input.Password placeholder="New Password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject("The two passwords do not match!");
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-button"
          loading={loading}
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>{showOtpForm ? "Reset Password" : "Forget Password"}</h2>
        <Spin spinning={loading}>
          {showOtpForm ? <OTPForm /> : <EmailForm />}
          <div className="additional-links">
            <div className="register-link">
              {showOtpForm ? (
                <>
                  Didn't receive OTP?{" "}
                  <a
                    className="try-again-link"
                    onClick={() => {
                      setShowOtpForm(false);
                      form.resetFields();
                    }}
                  >
                    Try Again
                  </a>
                </>
              ) : (
                <>
                  Remember your password? <Link to="/login">Login</Link>
                </>
              )}
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default ForgetPassword;
