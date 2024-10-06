import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import axios from "../utils/axiosConfig";
import "../css/Register.css";

const RegisterPage = () => {
  const [form] = Form.useForm();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      // Use params to send the data as query parameters instead of the request body
      const response = await axios.post("/Auth/Register/Customer", {
        name,
        email,
        password,
        roleId: "1",
      });

      // Store token if registration is successful
      const token = response.data.token;
      localStorage.setItem("token", token);
      message.success("Registration successful!");

      console.log("Registration successful: ", response.data);
    } catch (error) {
      console.error("Registration failed: ", error);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-bg" />
      <div className="register-form">
        <h2>Register</h2>
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
              {
                pattern: /^[a-zA-Z0-9\s]+$/,
                message: "Name can only contain letters, numbers, and spaces!",
              },
            ]}
          >
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one letter and one number.",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-button"
              block
            >
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
