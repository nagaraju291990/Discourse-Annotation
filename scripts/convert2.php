<?php 
$text = $_POST["text"];

$fp = fopen("in.txt","w");
fwrite($fp,$text);
fclose($fp);

$o = null;
$r = null;

$STDERR = fopen('out.txt', 'wb');
#call your python script here and make sure your python script is also at same place as this script
#$status = system("python3 tools/validate.py --lang=ta < in.txt > out.txt ");
$status = system("python3 conllu.py in.txt > out.txt ");

$fp_out = fopen("out.txt","r");
if ($fp_out) {
	while (($line = fgets($fp_out)) !== false) {
		// process the line read.
		echo "$line";
	}

	fclose($fp_out);
} else {
	// error opening the file.
} 

?>
