<?php
header('Content-Type: application/json');

$servername = "103.18.6.82";
$userID = "pck2uro1ax0t_ce410_admin";
$password = "12345678_CE410";
$dbname = "pck2uro1ax0t_ce410";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Use a fixed teacherID for testing
$teacherID = isset($_GET['userID']) ? $_GET['userID'] : '';

// Fetch teacher information
$teacher_sql = "SELECT name
    FROM user
    WHERE userID = ?
";

$stmt = $conn->prepare($teacher_sql);
$stmt->bind_param('s', $teacherID);
$stmt->execute();
$teacher_result = $stmt->get_result();
$teacher_info = $teacher_result->fetch_assoc();

// Fetch teacher courses
$courses_sql = "SELECT 
        courses.shortName,
        classes.startTime,
        classes.endTime,
        classes.classID
    FROM 
        classes
    JOIN 
        courses ON classes.courseID = courses.courseID
    WHERE 
        classes.teacherID = ?
";

$stmt = $conn->prepare($courses_sql);
$stmt->bind_param('s', $teacherID);
$stmt->execute();
$courses_result = $stmt->get_result();

$teacher_courses = [];
while ($row = $courses_result->fetch_assoc()) {
    $teacher_courses[] = $row;
}

// Fetch attendance data
$attendance_sql = "SELECT 
        attendances.classID,
        attendances.time,
        user.name AS studentName,
        courses.shortName AS courseName
    FROM 
        attendances
    JOIN 
        classes ON attendances.classID = classes.classID
    JOIN 
        courses ON classes.courseID = courses.courseID
    JOIN 
        user ON attendances.userID = user.userID
    WHERE 
        classes.teacherID = ?
";

$stmt = $conn->prepare($attendance_sql);
$stmt->bind_param('s', $teacherID);
$stmt->execute();
$attendance_result = $stmt->get_result();

$attendance_data = [];
while ($row = $attendance_result->fetch_assoc()) {
    $attendance_data[] = $row;
}
// Combine teacher info, courses, and attendance
$response = [
    'teacher_info' => $teacher_info,
    'teacher_courses' => $teacher_courses,
    'attendance_data' => $attendance_data
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>
