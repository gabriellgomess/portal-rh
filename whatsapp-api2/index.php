<?php

// liberar cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

// Função para enviar a mensagem via API de WhatsApp
function sendWhatsAppMessage($number, $message) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://cluster.apigratis.com/api/v2/whatsapp/sendText',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode(array(
            'number' => $number,
            'text' => $message
        )),
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'DeviceToken: 1808bb25-a9b4-48f7-bde0-b6f14c8b0f94',
            'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BsYXRhZm9ybWEuYXBpYnJhc2lsLmNvbS5ici9hdXRoL3JlZ2lzdGVyIiwiaWF0IjoxNzI2NTc2MDEyLCJleHAiOjE3NTgxMTIwMTIsIm5iZiI6MTcyNjU3NjAxMiwianRpIjoicXppb0RESjNkcXBnSFd6WSIsInN1YiI6IjExMzY1IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.EcwOwIcv3KOcwduEBGHrYTujInGnCAoK7bPhFRCeK54'
        ),
    ));

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        return 'Erro: ' . curl_error($curl);
    }

    curl_close($curl);

    return $response;
}

// Verifica se os dados foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decodifica o corpo da requisição JSON
    $data = json_decode(file_get_contents('php://input'), true);

    // Verifica se os dados foram enviados corretamente
    if (isset($data['messages']) && is_array($data['messages'])) {
        $results = [];

        // Loop pelos dados recebidos (array de mensagens)
        foreach ($data['messages'] as $entry) {
            if (isset($entry['number']) && isset($entry['text'])) {
                $number = $entry['number'];
                $message = $entry['text'];

                // Envia a mensagem via API
                $result = sendWhatsAppMessage($number, $message);
                $results[] = [
                    'number' => $number,
                    'result' => $result
                ];
            } else {
                $results[] = [
                    'error' => 'Dados inválidos para um dos itens'
                ];
            }
        }

        // Retorna os resultados
        echo json_encode(array('status' => 'success', 'results' => $results));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Estrutura de dados inválida.'));
    }
} else {
    echo json_encode(array('status' => 'error', 'message' => 'Método não permitido.'));
}
