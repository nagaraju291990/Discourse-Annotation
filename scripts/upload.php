<?php 
$t = microtime(true);
$micro = sprintf("%06d",($t - floor($t)) * 1000000);
$d = new DateTime( date('Y-m-d H:i:s.'.$micro, $t) );

//print $d->format("Ymd_His_u"); // note at point on "u"
$datetime = $d->format('Ymd_His_u');
#echo $datetime;
//$file = $_POST["inputfile"];
$dir = 'uploads/'.$datetime;
system("mkdir ".$dir."");

$filename = $_FILES['inputfile']['name']; 
#$ext = $info['inputfile']; // get the extension of the file
$ext = pathinfo($filename, PATHINFO_EXTENSION);
if($ext == "pdf"){
	$target = $dir.'/'.$filename;
	#echo $target;
	move_uploaded_file( $_FILES['inputfile']['tmp_name'], $target);
	system("pdftotext ".$target." ".$dir."/pdf.txt ");
	echo system("cat ".$dir."/pdf.txt");
	/*$a = new PDF2Text();
	$a->setFilename($filename); //grab the test file at http://www.newyorklivearts.org/Videographer_RFP.pdf
	$a->decodePDF();
	echo $a->output(); */
}
else {
	$target = $dir.'/'.$filename;
	#echo $target;
	echo file_get_contents($_FILES['inputfile']['tmp_name']); 
	move_uploaded_file($_FILES['inputfile']['tmp_name'], $target);
}
#$newname = $; 

/*$target = $dir.'/'.$filename;
#echo $target;
move_uploaded_file( $_FILES['inputfile']['tmp_name'], $target);*/
?>
