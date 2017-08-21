<?php
  if(!empty($_POST['data'])){
    $data = $_POST['data'];
    /* Write */
    file_put_contents('../database/data.json', json_encode($data));
  } else{
    /* Read */
    echo file_get_contents('../database/data.json');
  }
?>
