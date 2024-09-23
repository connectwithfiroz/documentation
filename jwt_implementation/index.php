<?php

use function PHPSTORM_META\type;

$root_dir = $_SERVER['DOCUMENT_ROOT'].'/'.explode("/", $_SERVER['SCRIPT_NAME'])[1];
require_once($root_dir."/Global/reuse.php");

//=================(START) FOR LOADING THE ENV DATA ==================//
require_once($root_dir.'/vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable($root_dir);
$dotenv->load();
// echo $_ENV['JWT_KEY']; exit;
//=================(END) FOR LOADING THE ENV DATA ==================//

require_once($root_dir."/connection/connection.php");
require_once($root_dir."/controller/JWTHandler.php");

//=========== For file upload start ===========//
require_once($root_dir."/connection/connection.php");
require_once($root_dir."/connection/couchdb_connection.php");
//=========== For file upload end ===========//


//(START)=== DEFINE ALL FUNCTION HERE ===//
class GVCExtAPIController extends DbConnection{
    // _______ For establishing the connection start _______ //
    public $db_connect;
    public $user_id ;//change later
    public $office_id;//change later based on logged user
    public $ip;
    public $my_secret_key;

    public function __construct() {
        $this->db_connect = $this->db_connection();

        $this->user_id = 1;//change later
        $this->office_id = 1;//change later based on logged user
        $this->ip = getIP();
        $this->my_secret_key = $_ENV['JWT_KEY'];
        // $this->my_secret_key = '68V0zWFrS72GbpPreidkQFLfj4v9m3Ti+DXc8OB0gcM=';
    }
    // _______ For establishing the connection end _______ //


    private function postMethodCheck($req){
        if ($req != 'POST') {
            $response = [
                'message' =>  'Only POST requests is allowed',
                'success' => false,
                'status' => 'failed',
                'status_code' => 422
            ];
            returnJson($response, 422);
            exit;
        }
    }

    function generate_token() {
        //--------- METHOD CHECK Start ---------//
        $this->postMethodCheck($_SERVER['REQUEST_METHOD']);
        //--------- METHOD CHECK END ---------//
        validate($_POST, [
            'secret_key' => 'required'
        ], ['return_back' => false]);
        //======== GET DATA FROM REQUEST START ========//
        $request = senitizeArr($_POST);
        //======== GET DATA FROM REQUEST END ========//
        //--- Match secret key first Start---//
        if($request->secret_key != $this->my_secret_key){
            $response = [
                'success' => false,
                'status' => 'failed',
                'message' => 'Invalid Secret Key',
                'status_code' => 401
            ];
            returnJson($response);
        }
        //--- Match secret key first End---//

        
        $issued_at = date('Y-m-d H:i:s');
        $expiration_time = date('Y-m-d  H:i:s', strtotime($issued_at . ' +3 years'));

        // new payload
        $date   = new DateTimeImmutable();
        $expire_at     = $date->modify('+3 years')->getTimestamp();      // Add 60 seconds

        $issued_at = date('Y-m-d H:i:s');

        $payload = [
            'iat'  => $date->getTimestamp(),         // Issued at: time when the token was generated
            'nbf'  => $date->getTimestamp(),         // Not before
            'exp'  => $expire_at,                           // Expire
            'user_name' => 'ESARKAR',
            'user_id' => 1,  
        ];
        $jwtHandler = new JwtHandler($this->my_secret_key);
    
        $jwt = $jwtHandler->generateJWTToken($payload);

        $response = [
            'success' => true,
            'status' => 'success',
            'message' => 'New Secret Key Generated',
            'token' => $jwt,
            'issued_at' => $issued_at,
            'expiration_time' => ($expiration_time),
            'status_code' => 200
        ];
        returnJson($response);
    }

    //---------------------- E-Sarkar Entry Function Start ---------------------------//
    function esarkar_inward_tappal() {
        
        //--------- Token Check Start ---------//
        $headers = getallheaders();
        $jwt_token = $headers['Authorization'] ?? null;
        if (! preg_match('/Bearer\s(\S+)/', $jwt_token, $matches)) {
            $msg = 'Token not found in request';
            $response = [
                'message' => $msg,
                'success' => false,
                'status' => 'failed',
                'status_code' => 422
            ];
            returnJson($response, 422); 
            // returnJson('Token not found in request', 400);
            exit;
        }
        $token = $matches[1];
        if (! $token) {
            $msg = "INVALID HEADER";

            $response = [
                'message' =>  'HTTP/1.0 400 Bad Request',
                'success' => false,
                'status' => 'failed',
                'status_code' => 422
            ];
            returnJson($response, 422); 

            // returnJson('HTTP/1.0 400 Bad Request');
            exit;
        }
        //--------- Token Check End ---------//

        // Verify the token and get user details if authenticated
        $jwtHandler = new JwtHandler($this->my_secret_key);
        $token_data = $jwtHandler->verifyJWTToken($token);   
        if($token_data['success'] == false){
            $msg = "TOKEN VALIDATION FAILED";
            logDetails($_SERVER['SCRIPT_FILENAME'],  $log_title,'FAILED', $msg, 'INSERT', $this->user_id, $this->office_id);

            $response = [
                'message' =>  $msg,
                'success' => false,
                'status' => 'failed',
                'status_code' => 401
            ];
            returnJson($response, 401); 
            // returnJson($token_data, 401);
        }else{
            $user_name = $token_data['data']->user_name;
            $this->user_id = $token_data['data']->user_id;
        }
       

        // Token is valid and not expired  after this you can write your logic
        
    }
     

    }
//(START) _______ Call function based on action parameter of url  _______//
#----------- Pass the object of above class in bindAction()
bindAction(new GVCExtAPIController);
//(END) _______ Call function based on action parameter of url  _______//
