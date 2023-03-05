<?php 
 include 'db.php';

$name = $_POST['username'];
$condithon = $_POST['userCon'];
$lon=$_POST['UsrLon'];
$lat =$_POST['UserLat'];

$add_query = "INSERT INTO gis_osm_transport_free_1(fclass,name,geom) VALUES('$condithon','$name',ST_MakePoint($lon,$lat))";
$query = pg_query($conn,$add_query);
if($query){
    echo json_encode(array("statusCode"=>200));
}else{
    echo json_encode(array("statusCode"=>201));
}
?>