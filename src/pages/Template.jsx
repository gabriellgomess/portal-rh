import React, { useState, useContext } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import { MyContext } from '../contexts/MyContext';
import { Routes, Route, Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

// Pages
import Dashboard from './Dashboard';
import SendWhatsApp from './SendWhatsApp';

const Template = (props) => {
  const { logoutUser } = useContext(MyContext);
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = props;

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          style={{ backgroundColor: theme.token.colorBgMenus, height: '100vh', color: theme.token.colorTextBase }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            {/* Remova o basePath, já que o App.jsx já lida com ele */}
            <Link to="/whatsapp">WhatsApp</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>   
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: theme.token.colorBgMenus,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '24px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button onClick={logoutUser} color="primary" variant="ghost">
            Sair
          </Button>
        </Header>
        <Content
          style={{
            padding: '24px 16px',
            height: 'calc(100vh - 112px)',
            backgroundColor: theme.token.colorBgBase,
          }}
        >
          <Routes>
            {/* As rotas agora não incluem o basePath */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsapp" element={<SendWhatsApp />} />            
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Template;
