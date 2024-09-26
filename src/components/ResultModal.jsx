import React from 'react';
import { Modal, Table, Button } from 'antd';

const ResultModal = ({ visible, data, onClose }) => {
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
    <Modal
      title="Resultados do Envio"
      visible={visible}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Fechar</Button>}
      width={800}
    >
      <Table columns={columns} dataSource={data} rowKey="number" pagination={false} />
    </Modal>
  );
};

export default ResultModal;
