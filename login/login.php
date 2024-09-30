<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

function msg($success, $status, $message, $extra = []) {
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

require __DIR__.'/classes/Database.php';
require __DIR__.'/classes/JwtHandler.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$returnData = [];



// SE O MÉTODO DE SOLICITAÇÃO NÃO FOR IGUAL A POST
if ($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0, 404, 'Página não encontrada!');

// VERIFICANDO CAMPOS VAZIOS
elseif (!isset($data->email) 
    || !isset($data->password)
    || empty(trim($data->email))
    || empty(trim($data->password))
    ):

    $fields = ['fields' => ['email', 'password']];
    $returnData = msg(0, 422, 'Por favor..., preencha todos os campos obrigatórios!', $fields);

// SE NÃO HOUVER CAMPOS VAZIOS, ENTÃO-
else:
    $email = trim($data->email);
    $password = trim($data->password);

    // VERIFICANDO O FORMATO DO EMAIL (SE FORMATO INVÁLIDO)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0, 422, 'Endereço de e-mail inválido!');
    
    // SE A SENHA TIVER MENOS DE 8 CARACTERES, MOSTRAR O ERRO
    elseif (strlen($password) < 8):
        $returnData = msg(0, 422, 'Sua senha deve ter pelo menos 8 caracteres!');

    // O USUÁRIO PODE REALIZAR A AÇÃO DE LOGIN
    else:
        try {
            
            $fetch_user_by_email = "SELECT * FROM `users` WHERE `email`=:email";
            $query_stmt = $conn->prepare($fetch_user_by_email);
            $query_stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $query_stmt->execute();

            // SE O USUÁRIO FOR ENCONTRADO PELO EMAIL
            if ($query_stmt->rowCount()):
                $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
                $check_password = password_verify($password, $row['password']);

                // VERIFICANDO A SENHA (ESTÁ CORRETA OU NÃO?)
                // SE A SENHA ESTIVER CORRETA, ENVIAR O TOKEN DE LOGIN
                if ($check_password):

                    $jwt = new JwtHandler();
                    $token = $jwt->_jwt_encode_data(
                        'http://localhost/php_auth_api/',
                        array("user_id" => $row['id'])
                    );
                    
                    $returnData = [
                        'success' => 1,
                        'message' => 'Você fez login com sucesso.',
                        'token' => $token
                    ];

                // SE A SENHA FOR INVÁLIDA
                else:
                    $returnData = msg(0, 422, 'Senha inválida!');
                endif;

            // SE O USUÁRIO NÃO FOR ENCONTRADO PELO EMAIL, MOSTRAR O SEGUINTE ERRO
            else:
                $returnData = msg(0, 422, 'Endereço de e-mail inválido!');
            endif;
        }
        catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }

    endif;

endif;

echo json_encode($returnData);

?>
