import React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const MessageForm = ({ setModalData, setModalVisible }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (values) => {
    const { number, message: text } = values;
    const formattedNumber = `55${number}`;
    try {
      const response = await axios.post('https://api-asaas.nexustech.net.br/whatsapp-api/index.php', {
        messages: [{ number: formattedNumber, text }],
      });
      if (response.data.status === 'success') {
        const parsedResult = JSON.parse(response.data.results[0].result);
        const processedData = [
          {
            number: response.data.results[0].number,
            status: parsedResult.error ? 'Erro' : 'Sucesso',
            message: parsedResult.message || parsedResult.response.message,
          },
        ];
        setModalData(processedData);
        setModalVisible(true);
      } else {
        message.error('Erro ao processar a mensagem.');
      }
    } catch (error) {
      message.error('Erro ao enviar a mensagem.');
    }
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFormSubmit} layout="vertical" style={{ minWidth: '300px' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="number"
            label="Número"
            rules={[{ required: true, message: 'Por favor, insira o número de telefone' }]}
          >
            <Input addonBefore="+55" placeholder="Número de telefone" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Mensagem"
            rules={[{ required: true, message: 'Por favor, insira a mensagem' }]}
          >
            <TextArea placeholder="Mensagem" rows={4} />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" block>
        Enviar
      </Button>
    </Form>
  );
};

export default MessageForm;
