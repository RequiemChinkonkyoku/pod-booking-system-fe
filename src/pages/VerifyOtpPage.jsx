import { Button, Form, Input } from "antd";
import axios from "../utils/axiosConfig";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";

const VerifyOtpPage = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      // Use query parameters as per your backend requirement
      const response = await axios.post(`/Auth/Verify/${otp}?email=${email}`);

      // Store token if login is successful
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("Verification successful");
      navigate("/login");
    } catch (error) {
      console.error("Verification failed: ", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>VERIFY ACCOUNT</h2>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit} // Keep onFinish for form submission
          layout="vertical"
        >
          <Form.Item
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Set email value on change
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email", // Ensure the value is a valid email format
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)} // Set password value on change
            rules={[
              {
                required: true,
                message: "Please input your OTP!",
              },
            ]}
          >
            <Input placeholder="OTP" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
            >
              VERIFY
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
