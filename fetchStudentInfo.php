<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ce410";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Use a fixed userID for testing
$userID = isset($_GET['userID']) ? $_GET['userID'] : '';

// Fetch student information
$student_sql = "SELECT *
    FROM user
    WHERE userID = ?
";

$stmt = $conn->prepare($student_sql);
$stmt->bind_param('s', $userID);
$stmt->execute();
$student_result = $stmt->get_result();
$student_info = $student_result->fetch_assoc();

// Fetch student courses
$courses_sql = "SELECT 
        courses.shortName,
        classes.startTime,
        classes.endTime
    FROM 
        `student in class`
    JOIN 
        classes ON classes.classID = `student in class`.classID
    JOIN
        courses ON classes.courseID = courses.courseID
    WHERE 
        `student in class`.studentID = ?
";

$stmt = $conn->prepare($courses_sql);
$stmt->bind_param('s', $userID);
$stmt->execute();
$courses_result = $stmt->get_result();

$student_courses = [];
while ($row = $courses_result->fetch_assoc()) {
    $student_courses[] = $row;
}

$attendance_sql = "SELECT 
        courses.shortName AS courseName,
        attendances.time
    FROM 
        attendances
    JOIN 
        classes ON attendances.classID = classes.classID
    JOIN 
        courses ON classes.courseID = courses.courseID
    WHERE 
        attendances.userID = ?
";

$stmt = $conn->prepare($attendance_sql);
$stmt->bind_param('s', $userID);
$stmt->execute();
$attendance_result = $stmt->get_result();

$attendance_data = [];
while ($row = $attendance_result->fetch_assoc()) {
    $attendance_data[] = $row;
}

// Combine student info, courses, and attendance
$response = [
    'student_info' => $student_info,
    'student_courses' => $student_courses,
    'attendance_data' => $attendance_data
];
echo json_encode($response);

$stmt->close();
$conn->close();
?>
