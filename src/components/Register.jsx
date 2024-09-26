import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MyContext } from "../contexts/MyContext";


function Register() {
  const { toggleNav, registerUser } = useContext(MyContext);
  const initialState = {
    userInfo: {
      name: "",
      email: "",
      password: "",
    },
    errorMsg: "",
    successMsg: "",
  };
  const [state, setState] = useState(initialState);

  // On Submit the Registration Form
  const submitForm = async (values) => {
    const data = await registerUser(values);
    if (data.success) {
      setState({
        ...initialState,
        successMsg: data.message,
      });
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
    // console.log(values);
  };

  // Show Message on Success or Error
  let successMsg = "";
  let errorMsg = "";
  if (state.errorMsg) {
    errorMsg = <div className="error-msg">{state.errorMsg}</div>;
  }
  if (state.successMsg) {
    successMsg = <div className="success-msg">{state.successMsg}</div>;
  }

  return (
    <Card
      title="Cadastro de Usuário"
      bordered={false}
      style={{
        width: 350,
      }}
    >
      <Form onFinish={() => submitForm(state.userInfo)} layout="vertical">
        <Form.Item label="Nome">
          <Input
            name="name"
            required
            value={state.userInfo.name}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, name: e.target.value } })}
            placeholder="Digite seu nome completo"
          />
        </Form.Item>
        <Form.Item label="Usuário">
          <Input
            name="email"
            required
            type="text"
            value={state.userInfo.email}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, email: e.target.value } })}
            placeholder="Digite seu usuário"
          />
        </Form.Item>
        <Form.Item label="Senha">
          <Input.Password
            name="password"
            required
            value={state.userInfo.password}
            onChange={(e) => setState({ ...state, userInfo: { ...state.userInfo, password: e.target.value } })}
            placeholder="Digite sua senha"
          />
        </Form.Item>
        {errorMsg}
        {successMsg}
        <div>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
        </div>
      </Form>
      <div>
        <Button variant="outlined" onClick={toggleNav}>Entrar</Button>
      </div>
    </Card>
  );
}

export default Register;
