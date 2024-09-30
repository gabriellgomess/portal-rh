<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function msg($success, $status, $message, $extra = []) {
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

// INCLUINDO BANCO DE DADOS E CRIANDO O OBJETO
require __DIR__.'/classes/Database.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();

// RECEBENDO DADOS DA REQUISIÇÃO
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// SE O MÉTODO DE SOLICITAÇÃO NÃO FOR POST
if ($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0, 404, 'Página não encontrada!');

// VERIFICANDO CAMPOS VAZIOS
elseif (!isset($data->name) 
    || !isset($data->email) 
    || !isset($data->password)
    || empty(trim($data->name))
    || empty(trim($data->email))
    || empty(trim($data->password))
    ):

    $fields = ['fields' => ['name', 'email', 'password']];
    $returnData = msg(0, 422, 'Por favor, preencha todos os campos obrigatórios!', $fields);

// SE NÃO HOUVER CAMPOS VAZIOS, ENTÃO-
else:
    
    $name = trim($data->name);
    $email = trim($data->email);
    $password = trim($data->password);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0, 422, 'Endereço de e-mail inválido!');
    
    elseif (strlen($password) < 8):
        $returnData = msg(0, 422, 'Sua senha deve ter pelo menos 8 caracteres!');

    elseif (strlen($name) < 3):
        $returnData = msg(0, 422, 'Seu nome deve ter pelo menos 3 caracteres!');

    else:
        try {

            $check_email = "SELECT `email` FROM `users` WHERE `email`=:email";
            $check_email_stmt = $conn->prepare($check_email);
            $check_email_stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $check_email_stmt->execute();

            if ($check_email_stmt->rowCount()):
                $returnData = msg(0, 422, 'Este e-mail já está em uso!');
            
            else:
                $insert_query = "INSERT INTO `users`(`name`,`email`,`password`) VALUES(:name,:email,:password)";

                $insert_stmt = $conn->prepare($insert_query);

                // LIGAÇÃO DE DADOS
                $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)), PDO::PARAM_STR);
                $insert_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                $insert_stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);

                $insert_stmt->execute();

                $returnData = msg(1, 201, 'Você se registrou com sucesso.');

            endif;

        }
        catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }
    endif;
    
endif;

echo json_encode($returnData);
?>
