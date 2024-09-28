import React, { useState } from 'react';
import { Modal, Table, Form, Row, Col, Card, Button, Upload, Typography, Spin, message, Input } from 'antd';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { TextArea } = Input;

const SendWhatsApp = () => {
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
        number: `55${entry.number}`,
        text: entry.message,
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
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/whatsapp-nexus/', {
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
        message.error('Erro ao processar as mensagens.');
      }
    } catch (error) {
      message.error('Erro ao enviar as mensagens.');
    } finally {
      setLoading(false);
    }
  };

  // Função para baixar a planilha modelo
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/assets/planilha_modelo.xlsx'; // O caminho para sua planilha modelo
    link.download = 'planilha_modelo.xlsx'; // Nome que será exibido ao baixar o arquivo
    link.click();
  };

  // Função para enviar mensagem individual via formulário
  const handleFormSubmit = async (values) => {
    const { number, message: text } = values;
    const formattedNumber = `55${number}`;
    try {
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/whatsapp-nexus/', {
        messages: [{ number: formattedNumber, text }],
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
        message.error('Erro ao processar a mensagem.');
      }
    } catch (error) {
      message.error('Erro ao enviar a mensagem.');
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title level={3}>Envio de mensagens via WhatsApp</Title>

      {/* Seção de envio em massa */}
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

      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Carregar Excel/CSV</Button>
      </Upload>

      <Button
        type="primary"
        onClick={sendMessagesInBulk}
        style={{ marginTop: '10px', width: '100%', maxWidth: '600px' }}
        block
      >
        Enviar Mensagens em Massa
      </Button>

      {/* Seção de mensagem individual */}
      <Card title="Enviar Mensagem Individual" bordered={false} style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
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
          <Button type="primary" htmlType="submit" block>
            Enviar
          </Button>
        </Form>
      </Card>

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

export default SendWhatsApp;
