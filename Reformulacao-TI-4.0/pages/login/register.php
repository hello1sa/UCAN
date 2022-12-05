<?php
 
$captcha = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : null;
 
if(!is_null($captcha)){
	$res = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=6LfzGg0jAAAAADy27LT-FTU7ngeqk0oo9pJTFtha&response=".$captcha."&remoteip=".$_SERVER['REMOTE_ADDR']));
	if($res->success === true){
		//CAPTCHA validado!!!

	}
	else{
		echo 'Erro ao validar o captcha!!!';
	}
}
else{
	echo 'Captcha não preenchido!';
}