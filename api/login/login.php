<?php
require_once 'include/DB_Function.php';
$db = new DB_Functions();

// json response array
$response = array(
  "error" => FALSE
);

$email = $_POST['email'];
$password = $_POST['password'];


// var_dump($response["uid"]); die();

if (isset($email) && isset($password)) {

    // menerima parameter POST ( email dan password )
    $email = $_POST['email'];
    $password = $_POST['password'];

    // get the user by email and password
    // get user berdasarkan email dan password
    $user = $db->getUserByEmailAndPassword($email, $password);

    // $test_hashSSHA = $db->hashSSHA($password);
    // $test_uuid = $db->checkhashSSHA($test_hashSSHA,$password);

    // var_dump($user); die();

    if ($user != false) {
        // user ditemukan
        $response["error"] = 'noerore';
        $response["uid"] = $user["unique_id"];
        $response["user"]["nama"] = $user["nama"];
        $response["user"]["email"] = $user["email"];
        $response["error_msg"] = "Login Berhasil.";
        echo json_encode($response);
    } else {
        // user tidak ditemukan password/email salah
        $response["error"] = TRUE;
        $response["error_msg"] = "Login gagal. Password/Email salah";
        echo json_encode($response);
    }
} else {
    $response["error"] = TRUE;
    $response["error_msg"] = "Parameter (email atau password) ada yang kurang";
    echo json_encode($response);
}
?>
