import { Layout } from "antd";

const Header = (props) => {
  const { Header } = Layout;
  return (
    <Header
      style={{
        color: "white",
        backgroundColor: props.theme.token.colorPrimary,
      }}
    >
      Meu aplicativo
    </Header>
  );
};

export default Header;