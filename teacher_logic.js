document.addEventListener('DOMContentLoaded', function() {
    const teacherID = localStorage.getItem('loggedInUserID'); // Get the loggedInUserID from local storage

    if (!teacherID) {
        console.error('No teacherID found in local storage');
        return;
    }

    fetch(`http://localhost/MyWebsite/Kiet/fetchTeacherInfo.php?userID=${teacherID}`)
        .then(response => response.json())
        .then(data => {
            if (data.teacher_info && data.teacher_courses && data.attendance_data) {
                const teacherInfo = data.teacher_info.name;
                document.getElementById("greeting_teacher").innerText = "Hi, Mr " + teacherInfo;

                // Use teacher_courses to populate the course data
                const teacher_courses = [...new Set(data.teacher_courses.map(course => course.shortName))]; // Ensure distinct classes

                function generateTeacherCourseData(data) {
                    let table = document.createElement("table");
                    data.forEach(function(rowData) {
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        let button = document.createElement("button");
                        button.textContent = rowData;
                        button.addEventListener("click", function() {
                            selectElement("list1", button);
                        });
                        cell.appendChild(button);
                        row.appendChild(cell);
                        table.appendChild(row);
                    });
                    table.style.width = "95%";
                    return table;
                }

                let teacherCourseData = document.getElementById("teacher_course_data");
                teacherCourseData.appendChild(generateTeacherCourseData(teacher_courses));

                // Process attendance data
                const attendance_data = data.attendance_data.map(att => {
                    const classInfo = data.teacher_courses.find(cls => cls.classID === att.classID);
                    let status = "Absent";

                    if (classInfo) {
                        const classStartTime = new Date(classInfo.startTime);
                        const classEndTime = new Date(classInfo.endTime);
                        const attendanceTime = new Date(att.time);

                        const isSameDay = (date1, date2) => date1.getDay() === date2.getDay();
                        const isWithinClassTime = (attTime, startTime, endTime) => {
                            startTime.setFullYear(attTime.getFullYear(), attTime.getMonth(), attTime.getDate());
                            endTime.setFullYear(attTime.getFullYear(), attTime.getMonth(), attTime.getDate());
                            return attTime >= startTime && attTime <= endTime;
                        };

                        if (isSameDay(attendanceTime, classStartTime)) {
                            if (isWithinClassTime(attendanceTime, classStartTime, classEndTime)) {
                                const timeDiff = (attendanceTime - classStartTime) / (1000 * 60); // Difference in minutes
                                status = timeDiff <= 30 ? "Attend" : "Late";
                            }
                        }
                    }
                    
                    return [
                        att.courseName,
                        att.studentName,
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

                const attendance_header = ["Class", "Student Name", "Check-in Time", "Status"];

                function generateAttendanceData(data, headerData) {
                    let table = document.createElement("table");

                    let header_row = document.createElement("tr");
                    headerData.forEach(function(cellData) {
                        let header_cell = document.createElement("th");
                        header_cell.textContent = cellData;
                        header_cell.style.width = "25%";
                        header_row.appendChild(header_cell);
                    });
                    table.appendChild(header_row);
                    data.forEach(function(rowData) {
                        let row = document.createElement("tr");
                        rowData.forEach(function(cellData) {
                            let cell = document.createElement("td");
                            cell.textContent = cellData;
                            cell.style.width = "25%";
                            row.appendChild(cell);
                        });
                        table.appendChild(row);
                    });
                    table.style.width = "95%";
                    return table;
                }

                let attendanceData = document.getElementById("teacher_attendance_data");
                attendanceData.appendChild(generateAttendanceData(attendance_data, attendance_header));

                // Teaching dates (for the sake of completeness, using your original date range logic)
                const teachingDays = [...new Set(data.teacher_courses.map(course => {
                    const classStartTime = new Date(course.startTime);
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return days[classStartTime.getDay()];
                }))];

                function generateTeachingDate(days) {
                    let tableBody = document.createElement("table");

                    days.forEach(function(day) {
                        let row = document.createElement("tr");
                        let cell = document.createElement("td");
                        let button = document.createElement("button");
                        button.textContent = day;
                        button.addEventListener("click", function() {
                            selectElement("list2", button);
                        });
                        cell.appendChild(button);
                        row.appendChild(cell);
                        tableBody.appendChild(row);
                    });
                    tableBody.style.width = "95%";
                    return tableBody;
                }

                let teachingDate = document.getElementById("date_table_body");
                teachingDate.appendChild(generateTeachingDate(teachingDays));

                // Button click handling
                let selectedElements = { list1: null, list2: null };

                function selectElement(listId, button) {
                    // Initialize selectedElements if not already initialized
                    if (typeof selectedElements === 'undefined') {
                        selectedElements = {};
                    }

                    // Get the list element
                    const listElement = document.getElementById(listId);

                    // Remove 'selected' class from previously selected button in the same list
                    if (selectedElements[listId]) {
                        selectedElements[listId].classList.remove("selected");
                    }

                    // Add 'selected' class to the clicked button
                    button.classList.add("selected");

                    // Update selected element in the selectedElements object
                    selectedElements[listId] = button;

                    // Filter attendance data based on selected elements
                    let temp_attendance_data;

                    const selectedCourse = selectedElements["list1"] ? selectedElements["list1"].textContent : null;
                    const selectedDateStr = selectedElements["list2"] ? selectedElements["list2"].textContent : null;

                    if (selectedCourse && selectedDateStr) {
                        temp_attendance_data = attendance_data.filter(course =>
                            course[0] === selectedCourse && course[2].startsWith(selectedDateStr)
                        );
                    } else if (selectedCourse) {
                        temp_attendance_data = attendance_data.filter(course =>
                            course[0] === selectedCourse
                        );
                    } else if (selectedDateStr) {
                        temp_attendance_data = attendance_data.filter(course =>
                            course[2].startsWith(selectedDateStr)
                        );
                    } else {
                        temp_attendance_data = attendance_data;
                    }

                    displayFilteredStudents(attendance_header, temp_attendance_data);
                }

                function displayFilteredStudents(header, data) {
                    const studentListDiv = document.getElementById("teacher_attendance_data");
                    studentListDiv.innerHTML = "";

                    const table = document.createElement("table");

                    let header_row = document.createElement("tr");
                    header.forEach(function(cellData) {
                        let header_cell = document.createElement("th");
                        header_cell.textContent = cellData;
                        header_cell.style.width = "25%";
                        header_row.appendChild(header_cell);
                    });
                    table.appendChild(header_row);

                    studentListDiv.appendChild(table);
                    data.forEach(function(rowData) {
                        let row = document.createElement("tr");
                        rowData.forEach(function(cellData) {
                            let cell = document.createElement("td");
                            cell.textContent = cellData;
                            cell.style.width = "25%";
                            row.appendChild(cell);
                        });
                        table.appendChild(row);
                    });
                    table.style.width = "95%";
                }
            } else {
                console.error('No teacher data found.');
            }
        })
        .catch(error => console.error('Error fetching teacher data:', error));
});
