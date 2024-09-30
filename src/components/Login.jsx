import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Card, theme } from "antd";
import { MyContext } from "../contexts/MyContext";
import BgLogin from "../assets/bg-login-min.jpg";

function Login(props) {
  const { toggleNav, loginUser, isLoggedIn } = useContext(MyContext);

  const initialState = {
    userInfo: {
      email: "",
      password: "",
    },
    errorMsg: "",
    successMsg: "",
  };

  const [state, setState] = useState(initialState);

  const onChangeValue = (e) => {
    setState({
      ...state,
      userInfo: {
        ...state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const submitForm = async () => {
    const data = await loginUser(state.userInfo);
    if (data.success && data.token) {
      setState({
        ...initialState,
      });
      localStorage.setItem("loginToken", data.token);
      await isLoggedIn();
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  let successMsg = "";
  let errorMsg = "";
  if (state.errorMsg) {
    errorMsg = (
      <div className="ant-form-explain error-msg">
        {state.errorMsg}
      </div>
    );
  }
  if (state.successMsg) {
    successMsg = (
      <div className="ant-form-explain success-msg">
        {state.successMsg}
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: `url(${BgLogin})`, width: '100vw', height: '100vh', backgroundSize: 'cover', backgroundPosition: '50%', display: 'flex', justifyContent: 'end' }}>
      <div style={{ background: 'rgba(32, 32, 32, 0.35)', backdropFilter: 'blur(5.5px)', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 50px' }}>
        <Card
          title="Login"
          bordered={false}
          style={{
            width: 350,
            background: props.theme.token.colorBgMenus,
            opacity: '1',
          }}
          
        >
          <Form onFinish={submitForm} layout="vertical">
            <Form.Item label="E-mail">
              <Input
                name="email"
                type="user"
                value={state.userInfo.email}
                onChange={onChangeValue}
              />
            </Form.Item>
            <Form.Item label="Senha">
              <Input.Password name="password" value={state.userInfo.password} onChange={onChangeValue} />
            </Form.Item>
            {errorMsg}
            {successMsg}
            <Button color="default" htmlType="submit">
              Entrar
            </Button>
          </Form>
          {/* <Button onClick={toggleNav} variant="outlined">
            Cadastrar
          </Button> */}
        </Card>
      </div>

    </div>

  );
}

export default Login;
