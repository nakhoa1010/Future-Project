const student_info = ["Trần Gia Kiệt", "20521504", "MTCL2020.1"];
const student_class = [["CS103", "Monday 1:30-5:15"], ["CS104", "Wednesday 1:30-5:15"], ["CS105", "Thursday 1:30-5:15"]];
const courseTableData = [
    ["CS103", "2024-05-14 1:30", "Attend"],
    ["CS105", "2024-05-14 3:45", "Attend"],
    ["CS103", "null", "Absent"],
    ["CS104", "2024-05-15 2:00", "Attend"],
    ["CS105", "2024-05-15 3:45", "Attend"],
];
const course_table_header = ["Class", "Time", "Status"];
const student_name = document.getElementById("student_name");
student_name.innerHTML = student_info[0];

const student_id = document.getElementById("student_id");
student_id.innerHTML = student_info[1];

const class_id = document.getElementById("class_id");
class_id.innerHTML = student_info[2];

function generateCourseData(data) {
    let table = document.createElement("table");
    data.forEach(function (rowData) {
        let row = document.createElement("tr");
        rowData.forEach(function (cellData) {
            let cell = document.createElement("td");
            cell.textContent = cellData;
            cell.style.width = "50%";
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    table.style.width = "95%";
    return table;
}

function generateAttendanceData(data, headerData) {
    let table = document.createElement("table");

    let header_row = document.createElement("tr");
    headerData.forEach(function (cellData) {
        let header_cell = document.createElement("th");
        header_cell.textContent = cellData;
        header_cell.style.width = "33%";
        header_row.appendChild(header_cell);
    })
    table.appendChild(header_row);
    data.forEach(function (rowData) {
        let row = document.createElement("tr");
        rowData.forEach(function (cellData) {
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

let attendanceData = document.getElementById("attendance_data");
attendanceData.appendChild(generateAttendanceData(courseTableData, course_table_header));