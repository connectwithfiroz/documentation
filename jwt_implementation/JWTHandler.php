<?php
// JwtHandler.php
$root_dir = $_SERVER['DOCUMENT_ROOT'].'/'.explode("/", $_SERVER['SCRIPT_NAME'])[1];
require_once '../vendor/autoload.php'; // If using firebase/php-jwt library

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
class JwtHandler {
    private $secret_key;

    public function __construct($secret_key) {
        $this->secret_key = $secret_key;
        // $this->secret_key = '68V0zWFrS72GbpPreidkQFLfj4v9m3Ti+DXc8OB0gcM='; // YOU CAN DIRECLY HARD CODED YOUR SECRET KEY (NOT RECOMMENDED)
    }

    // Function to generate JWT token
    public function generateJWTToken($payload) {
        return JWT::encode(
            $payload,
            $this->secret_key,
            'HS512'
        );
    }

    // Function to verify JWT token
    public function verifyJWTToken($jwt_token) {
        try {
            $token = JWT::decode($jwt_token, new Key($this->secret_key, 'HS512'));
            $now = new DateTimeImmutable();    
            if (
                $token->exp < $now->getTimestamp())
            {
                return ['status' => 'success','success'=>false, 'status_code'=> 200, 'data' => [], 'message' => 'Token Expired'];  
            }else{
                return ['status' => 'success','success'=>true, 'status_code'=> 200, 'data' => $token, 'message' => 'Success'];  
            }
        } catch (Exception $e) {
            return ['status' => 'error','success'=>false, 'status_code'=> 401, 'data' => [], 'message' => 'Unauthorized, invalid token.'];  
        }

    }
}


?>
