import React, { useState } from 'react';
import { Layout, Typography, Switch, Space, Card } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import TodoList from './components/TodoList';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout
      className={darkMode ? 'dark' : ''}
      style={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(to right, #141e30, #243b55)'
          : 'linear-gradient(to right, #e0eafc, #cfdef3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: darkMode ? '#1f1f1f' : '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '0 24px',
        }}
      >
        <Space align="center">
          <BulbOutlined style={{ fontSize: 24, color: darkMode ? '#fadb14' : '#1890ff' }} />
          <Title level={4} style={{ color: darkMode ? '#f0f0f0' : '#000', margin: 0 }}>
            Task Manager
          </Title>
        </Space>
        <Space>
          <Text style={{ color: darkMode ? '#bbb' : '#555' }}>Toggle Theme</Text>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Space>
      </Header>

      <Content style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Card
          style={{ width: '100%', maxWidth: 600, minWidth: '90%', borderRadius: 12, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          bodyStyle={{ padding: 24 }}
        >
          <TodoList darkMode={darkMode} />
        </Card>
      </Content>
    </Layout>
  );
}
