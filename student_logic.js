document.addEventListener('DOMContentLoaded', function() {
    const userID = localStorage.getItem('loggedInUserID'); // Get the loggedInUserID from local storage

    if (!userID) {
        console.error('No teacherID found in local storage');
        return;
    }

    fetch(`http://localhost/MyWebsite/Kiet/fetchStudentInfo.php?userID=${userID}`)
        .then(response => response.json())
        .then(data => {
            if (data.student_info && data.student_courses && data.attendance_data) {
                const studentInfo = data.student_info;
                document.getElementById("student_name").innerText = studentInfo.name;
                document.getElementById("student_id").innerText = studentInfo.userID;
                document.getElementById("class_id").innerText = studentInfo.classCode || "N/A";

                // Use student_courses to populate the course data
                const student_class = data.student_courses.map(cls => [
                    cls.shortName,
                    formatSchedule(cls.startTime, cls.endTime)
                ]);

                function formatSchedule(startTimeStr, endTimeStr) {
                    const startTime = new Date(startTimeStr);
                    const endTime = new Date(endTimeStr);
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const day = days[startTime.getDay()];

                    const formatTime = date => {
                        let hours = date.getHours();
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        return `${hours}:${minutes} ${ampm}`;
                    };

                    return `${day} ${formatTime(startTime)} - ${formatTime(endTime)}`;
                }

                function generateCourseData(data) {
                    let table = document.createElement("table");
                    data.forEach(function(rowData) {
                        let row = document.createElement("tr");
                        rowData.forEach(function(cellData) {
                            let cell = document.createElement("td");
                            cell.textContent = cellData;
                            cell.style.width = "33%";
                            row.appendChild(cell);
                        });
                        table.appendChild(row);
                    });
                    table.style.width = "95%";
                    return table;
                }

                let courseData = document.getElementById("course_data");
                courseData.appendChild(generateCourseData(student_class));

                // Process attendance data
                const attendance_data = data.attendance_data.map(att => {
                    const attendanceTime = new Date(att.time);
                    let status = "Absent";

                    for (const classInfo of data.student_courses) {
                        const classStartTime = new Date(classInfo.startTime);
                        const classEndTime = new Date(classInfo.endTime);
                        const classDay = classStartTime.getDay();
                        const attendanceDay = attendanceTime.getDay();

                        // Adjust the class start and end times to the same day as the attendance
                        if (classDay === attendanceDay) {
                            classStartTime.setFullYear(attendanceTime.getFullYear(), attendanceTime.getMonth(), attendanceTime.getDate());
                            classEndTime.setFullYear(attendanceTime.getFullYear(), attendanceTime.getMonth(), attendanceTime.getDate());

                            const timeDiff = (attendanceTime - classStartTime) / (1000 * 60); // Difference in minutes

                            if (attendanceTime >= classStartTime && attendanceTime <= classEndTime) {
                                status = timeDiff <= 30 ? "Attend" : "Late";
                                break;
                            }
                        }
                    }

                    return [
                        att.courseName,
                        formatDateTime(att.time),
                        status
                    ];
                });

                function formatDateTime(dateTimeStr) {
                    const dateTime = new Date(dateTimeStr);
                    const day = dateTime.toLocaleString('en-US', { weekday: 'long' });
                    const date = dateTime.toLocaleDateString();
                    const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return `${day} ${date} ${time}`;
                }

                const course_table_header = ["Class", "Time", "Status"];

                function generateAttendanceData(data, headerData) {
                    let table = document.createElement("table");

                    let header_row = document.createElement("tr");
                    headerData.forEach(function(cellData) {
                        let header_cell = document.createElement("th");
                        header_cell.textContent = cellData;
                        header_cell.style.width = "33%";
                        header_row.appendChild(header_cell);
                    })
                    table.appendChild(header_row);
                    data.forEach(function(rowData) {
                        let row = document.createElement("tr");
                        rowData.forEach(function(cellData) {
                            let cell = document.createElement("td");
                            cell.textContent = cellData;
                            cell.style.width = "33%";
                            row.appendChild(cell);
                        });
                        table.appendChild(row);
                    });
                    table.style.width = "95%";
                    return table;
                }

                let attendanceData = document.getElementById("attendance_data");
                attendanceData.appendChild(generateAttendanceData(attendance_data, course_table_header));
            } else {
                console.error('No student data found.');
            }
        })
        .catch(error => console.error('Error fetching student data:', error));
});