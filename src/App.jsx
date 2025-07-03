import React, { useState } from "react";
import { Layout, Typography, Switch } from "antd";
import TodoList from "./components/TodoList";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#111" : "#fff",
      }}
    >
      <Header
        style={{
          backgroundColor: darkMode ? "#000" : "#001529",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          React Redux Todo
        </Title>
        <Switch
          checkedChildren="Dark"
          unCheckedChildren="Light"
          onChange={() => setDarkMode(!darkMode)}
        />
      </Header>
      <Content style={{ padding: 20 }}>
        <TodoList darkMode={darkMode} />
      </Content>
    </Layout>
  );
}
