import React, { useEffect, useState } from "react";
import { Layout, Typography, Switch, Space, Card, Grid, Row, Col } from "antd";
import { BulbOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import TodoList from "./components/TodoList";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <Layout
      className={darkMode ? "dark" : ""}
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(to right, #141e30, #243b55)"
          : "linear-gradient(to right, #e0eafc, #cfdef3)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: darkMode ? "#1f1f1f" : "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: screens.xs ? "0 16px" : "0 94px",
        }}
      >
        <Space align="center">
          <BulbOutlined
            style={{ fontSize: 24, color: darkMode ? "#fadb14" : "#1890ff" }}
          />
          <Title
            level={screens.xs ? 5 : 4}
            style={{ color: darkMode ? "#f0f0f0" : "#000", margin: 0 }}
          >
            Task Manager
          </Title>
        </Space>
        <Space>
          {darkMode ? (
            <SunOutlined
              style={{
                fontSize: 20,
                color: "#fadb14",
                cursor: "pointer",
              }}
              onClick={() => setDarkMode(!darkMode)}
            />
          ) : (
            <MoonOutlined
              style={{
                fontSize: 20,
                color: "#1890ff",
                cursor: "pointer",
              }}
              onClick={() => setDarkMode(!darkMode)}
            />
          )}
          {/* <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} /> */}
        </Space>
      </Header>

      <Content
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: screens.xs ? "8px" : "4px",
        }}
      >
        <Row justify="center" style={{ width: "100%" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card
              style={{
                width: "100%",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                padding: screens.xs ? "0px" : "16px",
                margin: screens.xs ? "8px auto" : "24px auto",
              }}
            >
              <TodoList darkMode={darkMode} />
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "auto",
          background: darkMode ? "#1f1f1f" : "#ffffff",
          color: darkMode ? "#f0f0f0" : "#000",
          padding: screens.xs ? "12px 16px" : "12px 24px",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          fontSize: screens.xs ? '12px' : '14px',
        }}
      >
        <strong>made with 💙 from Vivek</strong>
      </Footer>
    </Layout>
  );
}
