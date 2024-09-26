import React from 'react';
import { Card, Typography, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Função para baixar a planilha modelo
const downloadTemplate = () => {
  const link = document.createElement('a');
  link.href = '/assets/planilha_modelo.xlsx'; // O caminho para sua planilha modelo
  link.download = 'planilha_modelo.xlsx'; // Nome que será exibido ao baixar o arquivo
  link.click();
};

const MessageLayoutTable = () => (
  <Card
    title="Layout da Planilha"
    bordered={false}
    actions={[
      <Button onClick={downloadTemplate}>
        Baixar Planilha Modelo <FileExcelOutlined />
      </Button>,
    ]}
    style={{ minWidth: '300px', width: '100%' }}
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
);

export default MessageLayoutTable;
