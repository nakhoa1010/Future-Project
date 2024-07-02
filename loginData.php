<?php
header('Content-Type: application/json');

$servername = "localhost";
$userID = "root";
$password = "";
$dbname = "ce410";

// Create connection
$conn = mysqli_connect($servername, $userID, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM user";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo json_encode([]);
}

$conn->close();

echo json_encode($data);
?>