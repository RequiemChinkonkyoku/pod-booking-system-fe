import { Button, Form, Input } from "antd";
import axios from "axios"; // Uncomment axios import since we're using it for API calls
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

const LoginPage = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const [credentials, setCredentials] = useState({
  //   email: "",
  //   password: "",
  // });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      // Use query parameters as per your backend requirement
      const response = await axios.post(
        `https://localhost:44314/Auth/Login?email=${email}&password=${password}`
      );

      // Store token if login is successful
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" />
      <div className="login-form">
        <h2>Login</h2>
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Set password value on change
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
      </div>
    </div>
  );
};

export default LoginPage;
