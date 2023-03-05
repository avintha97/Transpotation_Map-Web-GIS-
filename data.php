<?php
include 'db.php';

if ($_GET['value'] != '') {
  $value = $_GET['value'];

  if ($value == 'all' || $value == '*') {
    $query1 = "SELECT json_build_object(
'type', 'FeatureCollection',

'features', json_agg(
    json_build_object(
        'type',       'Feature',
        
        'geometry',   ST_AsGeoJSON(geom)::json,
        'properties', jsonb_set(row_to_json(gis_osm_transport_free_1)::jsonb,'{geom}','0',false)
    )
)
)
FROM gis_osm_transport_free_1 ";



    $resArray1 = pg_fetch_all(pg_query($conn, $query1));


    echo json_encode($resArray1);
  } else {

    $query2 = "SELECT json_build_object(
      'type', 'FeatureCollection',
      
      'features', json_agg(
          json_build_object(
              'type',       'Feature',
              
              'geometry',   ST_AsGeoJSON(geom)::json,
              'properties', jsonb_set(row_to_json(gis_osm_transport_free_1)::jsonb,'{geom}','0',false)
          )
      )
      )
      FROM gis_osm_transport_free_1 WHERE fclass='$value'";
    $resArray2 = pg_fetch_all(pg_query($conn, $query2));

    echo json_encode($resArray2);
  }
} else {
  echo 'error happning';
}
