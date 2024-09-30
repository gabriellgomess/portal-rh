import React, { useState } from 'react';
import { Modal, Table, Form, Button, Upload, Typography, Spin, message, Input, Tabs } from 'antd';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SendSMS = () => {
  const [numbersAndMessages, setNumbersAndMessages] = useState([]);
  const [invalidMessages, setInvalidMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
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

      const validMessages = [];
      const invalidMessages = [];

      json.forEach((entry) => {
        const message = entry.message;
        if (message.length > 140) {
          invalidMessages.push({
            number: `55${entry.number}`,
            text: message,
            error: 'Mensagem excede 140 caracteres'
          });
        } else {
          validMessages.push({
            number: `55${entry.number}`,  // Adiciona o código do país
            text: message,
          });
        }
      });

      setNumbersAndMessages(validMessages);
      setInvalidMessages(invalidMessages);

      if (invalidMessages.length > 0) {
        message.error('Algumas mensagens excedem o limite de 140 caracteres.');
      } else {
        message.success('Arquivo carregado com sucesso!');
      }
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
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/sms/', {
        messages: numbersAndMessages,
      });

      if (response.data.status === 'success') {
        const processedData = response.data.results.map((result) => {
          return {
            number: result.number,
            status: result.status,
            message: result.message,  // Exibe a mensagem retornada pela API
            requestUniqueId: result.requestUniqueId,  // Exibe o ID único da requisição, caso necessário
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
    link.href = 'https://portal-rh.nexustech.net.br/api/modelo/planilha_modelo.xlsx'; // O caminho para sua planilha modelo de SMS
    link.download = 'planilha_modelo_sms.xlsx'; // Nome que será exibido ao baixar o arquivo
    link.click();
  };

  // Função para enviar mensagem individual via formulário
  const handleFormSubmit = async (values) => {
    const { number, message: text } = values;

    if (text.length > 140) {
      message.error(`A mensagem excede 140 caracteres. Tente novamente com uma mensagem mais curta.`);
      return;
    }

    const formattedNumber = `55${number}`;
    try {
      const response = await axios.post('https://portal-rh.nexustech.net.br/api/sms/', {
        messages: [{ number: formattedNumber, message: text }],
      });

      if (response.data.status === 'success') {
        const processedData = [
          {
            number: response.data.results[0].number,
            status: response.data.results[0].status,
            message: response.data.results[0].message,
            requestUniqueId: response.data.results[0].requestUniqueId,
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

  // Função para contar caracteres
  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const columns = [
    { title: 'Número', dataIndex: 'number', key: 'number' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Mensagem', dataIndex: 'message', key: 'message' }, // Exibindo a mensagem da resposta
  ];

  const closeModal = () => {
    // limpar preview e inputs
    setNumbersAndMessages([]);
    form.resetFields();
    setModalVisible(false);
  };

  return (
    <div>
      <Title level={3}>Envio de mensagens via SMS</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Envio em Massa" key="1">
          {/* Seção de envio em massa */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Title level={5}>
                É possível carregar uma planilha contendo as colunas{' '}
                <span style={{ fontWeight: 'bold' }} translate="no" lang="en">
                  number
                </span>{' '}
                e{' '}
                <span style={{ fontWeight: 'bold' }} translate="no" lang="en">
                  message
                </span>{' '}
                contendo os números de telefone e as mensagens de SMS.
              </Title>
              <Title level={5}>No botão ao lado, é possível baixar a planilha modelo. <Button onClick={downloadTemplate}>
                Baixar Planilha Modelo <FileExcelOutlined />
              </Button></Title>
              
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Carregar Excel/CSV</Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={sendMessagesInBulk}

                >
                  Enviar Mensagens em Massa
                </Button>
              </div>
            </div>

            {/* Tabela de pré-visualização de mensagens válidas */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {numbersAndMessages.length > 0 && (
                <>
                  <Title level={5}>Prévia dos Dados Carregados</Title>
                  <Table
                    columns={[
                      { title: 'Número', dataIndex: 'number', key: 'number' },
                      { title: 'Mensagem', dataIndex: 'text', key: 'text' }, // Exibindo as mensagens válidas
                    ]}
                    dataSource={numbersAndMessages}
                    rowKey="number"
                    pagination={{ pageSize: 5 }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Tabela de pré-visualização de mensagens inválidas */}
          {invalidMessages.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Title level={5} style={{ color: 'red' }}>Mensagens Inválidas</Title>
              <Text>Vpcê poderá prosseguir com o envio, mas as mensagens abaixo serão desconsideradas</Text>
              <Table
                columns={[
                  { title: 'Número', dataIndex: 'number', key: 'number' },
                  { title: 'Mensagem', dataIndex: 'text', key: 'text' },
                  { title: 'Erro', dataIndex: 'error', key: 'error', render: () => <span style={{ color: 'red' }}>Excede 140 caracteres</span> },
                ]}
                dataSource={invalidMessages}
                rowKey="number"
                pagination={{ pageSize: 5 }}
              />
            </div>
          )}
        </TabPane>

        <TabPane tab="Envio Individual" key="2">
          <Form form={form} onFinish={handleFormSubmit} layout="vertical" style={{ maxWidth: '600px' }}>
            <Form.Item
              name="number"
              label="Número"
              rules={[{ required: true, message: 'Por favor, insira o número de telefone' }]}
            >
              <Input placeholder="Número de telefone" />
            </Form.Item>
            <Form.Item
              name="message"
              label={`Mensagem (${charCount}/140 caracteres)`}
              rules={[{ required: true, message: 'Por favor, insira a mensagem' }]}
            >
              <TextArea
                placeholder="Mensagem"
                rows={4}
                maxLength={140}
                onChange={handleTextChange}  // Atualiza o contador ao digitar
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enviar
            </Button>
          </Form>
        </TabPane>
      </Tabs>

      {/* Modal de resultados */}
      <Modal
        title="Resultados do Envio"
        visible={modalVisible}
        onCancel={closeModal}
        footer={<Button onClick={closeModal}>Fechar</Button>}
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
