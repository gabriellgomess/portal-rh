import React, { useState } from 'react';
import { Button, ConfigProvider, Typography, Spin, message, Flex, Divider, theme } from 'antd';
import MessageLayoutTable from '../components/MessageLayoutTable';
import FileUpload from '../components/FileUpload';
import MessageForm from '../components/MessageForm';
import ResultModal from '../components/ResultModal';
import axios from 'axios';




const { Title } = Typography;

const SendWhatsApp = () => {
  const [numbersAndMessages, setNumbersAndMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = theme.useToken();

  // Função para processar o arquivo Excel/CSV
  const handleFileUpload = (formattedData) => {
    setNumbersAndMessages(formattedData);
  };

  // Função para enviar o JSON com todas as mensagens para o backend
  const sendMessagesInBulk = async () => {
    if (numbersAndMessages.length === 0) {
      message.error('Nenhuma mensagem para enviar.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://api-asaas.nexustech.net.br/whatsapp-api/index.php', {
        messages: numbersAndMessages,
      });
      if (response.data.status === 'success') {
        const processedData = response.data.results.map((result) => {
          const parsedResult = JSON.parse(result.result);
          return {
            number: result.number,
            status: parsedResult.error ? 'Erro' : 'Sucesso',
            message: parsedResult.message || parsedResult.response.message,
          };
        });
        setModalData(processedData);
        setModalVisible(true);
      } else {
        message.error('Erro ao processar as mensagens.');
      }
    } catch (error) {
      message.error('Erro ao enviar as mensagens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <Flex vertical className="container">
        <Flex gap="middle" vertical justify='center' align='center'>
        
          <Title style={{ color: token.colorPrimary}} level={3}>
            Envio de mensagens via WhatsApp
          </Title>
        </Flex>       

        <Flex gap="middle" align='end' justify='center' wrap>
          <Flex vertical gap="middle" style={{maxWidth: '600px'}}>
            <MessageLayoutTable />
            <FileUpload onFileProcessed={handleFileUpload} />
            <Button
              type="primary"
              onClick={sendMessagesInBulk}
              style={{ marginTop: '10px' }}
              block
            >
              Enviar Mensagens em Massa
            </Button>
          </Flex>
          
          <Flex vertical>
            <Title level={4}>Mensagem individual</Title>
            <MessageForm setModalData={setModalData} setModalVisible={setModalVisible} />
          </Flex>
        </Flex>

        <ResultModal visible={modalVisible} data={modalData} onClose={() => setModalVisible(false)} />

        {loading && (
          <Flex className="loading-overlay">
            <Spin size="large" />
          </Flex>
        )}
      </Flex>
    
  );
};

export default SendWhatsApp;
