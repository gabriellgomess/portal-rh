import { useState, useContext } from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Ícones de marcas
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// Ícones sólidos
import { faChartLine, faCommentSms, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';


import { Breadcrumb, Button, Layout, Menu, ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Componente de Login
import Dashboard from './pages/Dashboard'; // página Dashboard
import SendWhatsApp from './pages/SendWhatsApp'; // página SendWhatsApp
import SendSMS from './pages/SendSMS'; // página SendSMS
import SendMail from './pages/SendMail'; // página SendMail
import Users from './pages/Users'; // página Users
import { MyContext } from './contexts/MyContext';

import LogoH from './assets/logo_horizontal_color_1.png';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, items) {
  return {
    key,
    icon,
    items,
    label,
  };
}

const items = [
  getItem('Dashboard (breve)', `${import.meta.env.VITE_REACT_APP_PATH}/dashboard`, <FontAwesomeIcon icon={faChartLine} />),
  getItem('WhatsApp', `${import.meta.env.VITE_REACT_APP_PATH}/sendwhatsapp`, <FontAwesomeIcon icon={faWhatsapp} />,),
  getItem('SMS', `${import.meta.env.VITE_REACT_APP_PATH}/sendsms`, <FontAwesomeIcon icon={faCommentSms} />),
  getItem('E-mail (breve)', `${import.meta.env.VITE_REACT_APP_PATH}/sendemail`, <FontAwesomeIcon icon={faEnvelope} />),
  getItem('Usuários', `${import.meta.env.VITE_REACT_APP_PATH}/users`, <FontAwesomeIcon icon={faUser} />),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Obtenha a localização atual da URL

  console.log(location);

  // Defina as cores personalizadas
  const customTheme = {
    token: {
      colorPrimary: '#b11116',
      colorSuccess: '#38a900',
      colorWarning: '#ffdd00',
      colorError: '#f67c7e',
      colorInfo: '#b11116',
      colorTextBase: '#313131',
      colorBgMenus: '#6d6e71',
      colorBgBase: '#f0f2f5',
      colorBgContainer: '#f0f2f5',
      borderRadiusLG: '8px',
      siderBg: '#b11116',
      triggerBg: '#b11116',
      triggerColor: '#fff',
    },
  };

  // Verifica se o usuário está autenticado usando o contexto
  const { rootState } = useContext(MyContext);
  const { isAuth } = rootState;

  // Se o usuário não está autenticado, mostra a tela de login
  if (!isAuth) {
    return <Login theme={customTheme} />;
  }

  // Caso o usuário esteja autenticado, mostra o conteúdo do app
  return (
    <ConfigProvider theme={customTheme} locale={ptBR}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{ background: customTheme.token.colorBgMenus }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          {/* Define o item ativo com base no caminho da URL */}
          <Menu
            style={{ background: customTheme.token.colorBgMenus }}
            selectedKeys={[location.pathname]} // Use location.pathname como selectedKeys
            mode="inline"
            theme='dark'
          >
            {items.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: customTheme.token.colorBgContainer,
            }}
          >
            <img src={LogoH} width={200} alt="" />
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.href = `/`;
              }}
            >
              Logout
            </Button>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{location.pathname}</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: customTheme.token.colorBgContainer,
                borderRadius: customTheme.token.borderRadiusLG,
                display: 'flex',
              }}
            >
              {/* Definindo as rotas para Dashboard e SendWhatsApp */}
              <Routes>
                <Route path="/" element={<Navigate to={`${import.meta.env.VITE_REACT_APP_PATH}/dashboard`} />} />
                <Route path={`${import.meta.env.VITE_REACT_APP_PATH}/dashboard`} element={<Dashboard />} />
                <Route path={`${import.meta.env.VITE_REACT_APP_PATH}/sendwhatsapp`} element={<SendWhatsApp />} />
                <Route path={`${import.meta.env.VITE_REACT_APP_PATH}/sendsms`} element={<SendSMS />} />
                <Route path={`${import.meta.env.VITE_REACT_APP_PATH}/sendemail`} element={<SendMail />} />
                <Route path={`${import.meta.env.VITE_REACT_APP_PATH}/users`} element={<Users />} />
              </Routes>

            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Portal RH ©{new Date().getFullYear()} Um produto Nexus Tech
            
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
