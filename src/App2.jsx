import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import MyContextProvider, { MyContext } from "./contexts/MyContext";
import ptBR from "antd/locale/pt_BR"

// Pages
import Home from "./pages/Home";
import Template from "./pages/Template";

//Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Layout components
const { Content } = Layout;

function WithAuthentication({ items }) {
  const { rootState } = useContext(MyContext);
  const { isAuth } = rootState;
  return isAuth ? (
    items
  ) : (
    <Navigate to={`${import.meta.env.VITE_REACT_APP_PATH}`} replace />
  );
}

const theme = {
  token: {
    colorPrimary: "#e9434b",
    colorSuccess: "#38a900",
    colorWarning: "#ffdd00",
    colorError: "#f67c7e",
    colorInfo: "#e9434b",
    colorTextBase: "#313131",
    colorBgMenus: "#74c3bb",
    colorBgBase: "#f0f2f5",
    borderRadius: '8px'
  },
};

const App = () => {
  return (
    <ConfigProvider theme={theme} locale={ptBR}>
      <MyContextProvider>
        <Layout style={{ minHeight: '100vh' }}>
          {/* <Header theme={theme} /> */}
          <Content style={{ display: "flex", justifyContent: "center" }}>

            <Routes>
              <Route path={`${import.meta.env.VITE_REACT_APP_PATH}`} element={<Home />} />
              <Route
                path={`${import.meta.env.VITE_REACT_APP_PATH}/dashboard`}
                element={
                  <WithAuthentication>
                    <Template theme={theme} />
                  </WithAuthentication>
                }
              />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </MyContextProvider>
    </ConfigProvider>
  );
};

export default App;
