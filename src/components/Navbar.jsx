import React, { useState, useEffect } from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row, Avatar, Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const user = false;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        {user ? <Link to={`/profile`}>Profile</Link> : null}
      </Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className={`navbarContainer ${scrolled ? "navbarScrolled" : ""}`}>
      <div className="navbarContent">
        <div className="navbarLeft">
          <Link to="/" className="navbarItem">
            <HomeOutlined style={{ fontSize: "24px" }} />
          </Link>
          <Link to="/" className="navbarItem">
            <strong>Home</strong>
          </Link>
          {/* <Link to="/contact" className="navbarItem">
            <strong>Contact</strong>
          </Link> */}
        </div>
        <div className="navbarRight">
          {!user ? (
            <>
              <Link to="/login" className="signInButton">
                <strong>Sign in</strong>
              </Link>
              <Link to="/register" className="signUpButton">
                <strong>Sign up</strong>
              </Link>
            </>
          ) : (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div className="profileContainer">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#d48b33" }}
                />
                <p>Username</p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
