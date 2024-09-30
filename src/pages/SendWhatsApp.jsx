import React, { useState } from 'react';
import { Modal, Table, Form, Button, Upload, Typography, Spin, message, Input, Tabs } from 'antd';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

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

      const processedData = response.data.results.map((result) => {
        const parsedResult = result.response || {}; // Verifica se a resposta existe

        return {
          number: result.number,
          status: parsedResult.error ? 'Erro' : 'Sucesso',
          message: parsedResult.error
            ? parsedResult.message || 'Erro desconhecido'
            : 'Requisição processada com sucesso',
        };
      });

      setModalData(processedData);
      setModalVisible(true); // Exibe o modal independentemente do status

    } catch (error) {
      message.error('Erro ao enviar as mensagens.');
      // Você pode logar o erro para debug
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  // Função para baixar a planilha modelo
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'https://portal-rh.nexustech.net.br/api/modelo/planilha_modelo.xlsx'; // O caminho para sua planilha modelo
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

  const closeModal = () => {
    // limpar preview e inputs
    setNumbersAndMessages([]);
    form.resetFields();
    setModalVisible(false);
  }

  return (
    <div>
      <Title level={3}>Envio de mensagens via WhatsApp</Title>
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
                contendo os números de telefone e as mensagens.
              </Title>
              <Title level={5}>No botão abaixo, é possível baixar a planilha modelo.</Title>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Button onClick={downloadTemplate}>
                  Baixar Planilha Modelo <FileExcelOutlined />
                </Button>
                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Carregar Excel/CSV</Button>
                </Upload>
              </div>
              <Button
                type="primary"
                onClick={sendMessagesInBulk}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Enviar Mensagens em Massa
              </Button>
            </div>

            {/* Tabela de pré-visualização */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {numbersAndMessages.length > 0 && (
                <>
                  <Title level={5}>Prévia dos Dados Carregados</Title>
                  <Table
                    columns={[
                      { title: 'Número', dataIndex: 'number', key: 'number' },
                      { title: 'Mensagem', dataIndex: 'text', key: 'text' },
                    ]}
                    dataSource={numbersAndMessages}
                    rowKey="number"
                    pagination={{ pageSize: 5 }}
                  />
                </>
              )}
            </div>
          </div>
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
              label="Mensagem"
              rules={[{ required: true, message: 'Por favor, insira a mensagem' }]}
            >
              <TextArea placeholder="Mensagem" rows={4} />
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
        <Table
          columns={[
            { title: 'Número', dataIndex: 'number', key: 'number' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            { title: 'Mensagem', dataIndex: 'message', key: 'message' },
          ]}
          dataSource={modalData}
          rowKey="number"
          pagination={false}
        />
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
