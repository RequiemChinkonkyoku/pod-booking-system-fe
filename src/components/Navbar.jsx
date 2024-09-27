import React from "react";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Row,
} from "antd";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        {user ? <Link to={`/profile`}>Profile</Link> : null}
      </Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="navbarContainer">
      <Row justify="space-between" align="middle">
        <Col xs={24} md={16}>
          <div className="navbarLeft">
            <Link to="/" className="navbarItem">
              <HomeOutlined style={{ fontSize: "26px" }} />
            </Link>
            <Link to="/" className="navbarItem">
              <strong>Home</strong>
            </Link>
            <Link to="/contact" className="navbarItem">
              <strong>Contact</strong>
            </Link>
            <Link ></Link>
          </div>
        </Col>
        <Col xs={24} md={8} className="navbarRightContainer">
          <div className="navbarRight">
            {/* <div className="searchContainer">
              <AutoComplete

                value={searchValue}
                options={suggestions.map((suggestion) => ({
                  value: suggestion.value,
                  label: <Link to={suggestion.link}>{suggestion.value}</Link>,
                }))}
                onChange={handleSearch}
                className="searchInput"
              >
                <Input prefix={<SearchOutlined className="searchIcon" />} />
              </AutoComplete>
            </div> */}
            <div className="signInButton">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button
                      style={{
                        marginRight: 10,
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <Dropdown overlay={userMenu}>
                  <div className="profileContainer">
                    <Avatar
                      size="large"
                      style={{
                        backgroundColor: "#1890ff",
                        fontSize: "20px",
                      }}
                    >
                      PD
                    </Avatar>
                    <p>dml</p>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
