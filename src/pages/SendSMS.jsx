import React, { useState } from 'react';
import { Modal, Table, Form, Flex, Card, Button, Upload, Typography, Spin, message, Input } from 'antd';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { TextArea } = Input;

const SendSMS = () => {
  const [numbersAndMessages, setNumbersAndMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Função para processar o arquivo Excel/CSV
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      const formattedData = json.map((entry) => ({
        number: entry.number,
        message: entry.message,
      }));
      setNumbersAndMessages(formattedData);
      message.success('Arquivo carregado com sucesso!');
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  // Função para enviar o JSON com todas as mensagens para o backend
  const sendMessagesInBulk = async () => {
    if (numbersAndMessages.length === 0) {
      message.error('Nenhuma mensagem para enviar.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/sms-nexus/', {
        messages: numbersAndMessages,
      });

      if (response.data.status === 'success') {
        const processedData = response.data.results.map((result) => {
          const parsedResult = result.response || {}; // Verifica se a resposta existe

          return {
            number: result.number,
            status: parsedResult.error ? 'Erro' : 'Sucesso', // Mantém a lógica de erro e sucesso
            message: parsedResult.message || 'Requisição processada com sucesso',
          };
        });
        setModalData(processedData);
        setModalVisible(true); // Exibe o modal independentemente do status
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para tratamento de erros específicos com base nos status HTTP da API
  const handleErrorResponse = (response) => {
    const status = response.status;
    if (status === 400) {
      message.error('Erro: Parâmetros inválidos ou informações insuficientes.');
    } else if (status === 401) {
      message.error('Erro de autenticação: Chave de acesso inválida ou usuário desativado.');
    } else if (status === 500) {
      message.error('Erro no servidor: Tente novamente mais tarde.');
    } else if (status === 503) {
      message.error('Erro de timeout: Não foi possível conectar ao endpoint.');
    } else {
      message.error('Erro desconhecido: Verifique os dados enviados.');
    }
  };

  // Tratamento de erros de rede ou falhas inesperadas
  const handleNetworkError = (error) => {
    if (error.response) {
      handleErrorResponse(error.response);
    } else if (error.request) {
      message.error('Erro de rede: Não foi possível alcançar o servidor.');
    } else {
      message.error('Erro desconhecido: ' + error.message);
    }
  };

  // Função para baixar a planilha modelo
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/assets/planilha_modelo_sms.xlsx'; // O caminho para sua planilha modelo
    link.download = 'planilha_modelo_sms.xlsx'; // Nome que será exibido ao baixar o arquivo
    link.click();
  };

  // Função para enviar mensagem individual via formulário
  const handleFormSubmit = async (values) => {
    const { number, message: text } = values;
    try {
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/sms/', {
        messages: [{ number, message: text }],
      });

      if (response.data.status === 'success') {
        const parsedResult = response.data.results[0].response || {}; // Verifica se a resposta existe

        const processedData = [
          {
            number: response.data.results[0].number,
            status: parsedResult.error ? 'Erro' : 'Sucesso',
            message: parsedResult.message || 'Requisição processada com sucesso',
          },
        ];
        setModalData(processedData);
        setModalVisible(true); // Exibe o modal independentemente do status
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      handleNetworkError(error);
    }
    form.resetFields();
  };

  const columns = [
    { title: 'Número', dataIndex: 'number', key: 'number' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Sucesso' ? 'green' : 'red' }}>{status}</span>
      ),
    },
    { title: 'Mensagem', dataIndex: 'message', key: 'message' },
  ];

  return (
    <div>
      <Title level={3}>Envio de mensagens via SMS</Title>
      {/* Seção de envio em massa */}
      <Flex>
        <Flex vertical  style={{flexFlow: '1'}}>
        <Card
        title="Layout da Planilha"
        bordered={false}
        actions={[
          <Button onClick={downloadTemplate} key="download">
            Baixar Planilha Modelo <FileExcelOutlined />
          </Button>,
        ]}
        style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}
      >
        <p>
          É possível carregar uma planilha contendo as colunas{' '}
          <span style={{ fontWeight: 'bold' }} translate="no" lang="en">
            number
          </span>{' '}
          e{' '}
          <span style={{ fontWeight: 'bold' }} translate="no" lang="en">
            message
          </span>{' '}
          contendo os números de telefone e as mensagens.
        </p>
      </Card>
        {/* Upload */}
      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Carregar Excel/CSV</Button>
      </Upload>
        {/* botão de upload */}
      <Button
        type="primary"
        onClick={sendMessagesInBulk}
        style={{ marginTop: '10px', width: '100%', maxWidth: '600px' }}
        block
      >
        Enviar Mensagens em Massa
      </Button>
      </Flex>
      <Flex style={{flexFlow: '1'}}>
      <Card title="Enviar Mensagem Individual" bordered={false} style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="number"
            label="Número"
            rules={[{ required: true, message: 'Por favor, insira o número de telefone' }]}
          >
            <Input placeholder="Número de telefone" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Mensagem"
            rules={[{ required: true, message: 'Por favor, insira a mensagem' }]}
          >
            <TextArea placeholder="Mensagem" rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Enviar
          </Button>
        </Form>
      </Card>
      </Flex>
      </Flex>
      



      {/* Modal de resultados */}
      <Modal
        title="Resultados do Envio"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Button onClick={() => setModalVisible(false)}>Fechar</Button>}
        width={800}
      >
        <Table columns={columns} dataSource={modalData} rowKey="number" pagination={false} />
      </Modal>

      {/* Spinner de loading */}
      {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default SendSMS;
