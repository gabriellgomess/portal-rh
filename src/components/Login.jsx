import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MyContext } from "../contexts/MyContext";

function Login() {
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
    <Card
    title="Login"
    bordered={false}
    style={{
      width: 350,
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
      <Button type="primary" htmlType="submit">
        Entrar
      </Button>
    </Form>
    <Button onClick={toggleNav} variant="outlined">
          Cadastrar
        </Button>
    </Card>
  );
}

export default Login;
