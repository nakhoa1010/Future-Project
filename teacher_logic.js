const teacher_info = "Nguyen Minh Son";
const attendance_data = [
    ["CS103", "Tran Gia Kiet", "30-4-2024 3:45", "Attend" ],
    ["CS103", "Vu Ho C", "30-4-2024 3:45", "Attend" ],
    ["CS103", "Van Duy D", "30-4-2024 3:45", "Attend" ],
    ["CS103", "Nguyen Huu Minh Tam", "null", "Absent" ],
    ["CS106", "Tran Gia Kiet", "07-05-2024 3:45", "Attend" ],
    ["CS106", "Van Duy D", "07-05-2024 1:45", "Attend" ],
    ["CS106", "Vu Ho C", "07-05-2024 2:45", "Attend" ],
    ["CS106", "Nguyen Huu Minh Tam", "07-05-2024 4:45", "Attend" ],
    ["CS109", "Tran Gia Kiet", "14-05-2024 1:30", "Attend" ],
    ["CS109", "Van Duy D", "14-05-2024 3:45", "Attend" ],
    ["CS109", "Vu Ho C", "null", "Absent" ],
    ["CS109", "Nguyen Huu Minh Tam", "14-05-2024 2:00", "Attend" ],
];

let temp_attendance_data = attendance_data;
const teacher_course = ["CS103","CS106","CS109"];
const attendance_header = ["Student Name","Check-in Time","Status"];
teacher_greeting = document.getElementById("greeting_teacher");
teacher_greeting.innerHTML = "Hi, Mr " + teacher_info;

//Teacher Attendance Data
function generateAttendanceData(data,headerData){
    let table = document.createElement("table");
    
    let header_row = document.createElement("tr");
    headerData.forEach(function(cellData){
        let header_cell = document.createElement("th");
        header_cell.textContent = cellData;
        header_cell.style.width = "33%";
        header_row.appendChild(header_cell);
    })
    table.appendChild(header_row);  
    data.forEach(function(rowData) {
        let row = document.createElement("tr");
        rowData.slice(1).forEach(function(cellData){
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
//Teacher Course
function generateTeacherCourseData(data){
    let table = document.createElement("table");
    data.forEach(function(rowData) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        let button = document.createElement("button");
        button.textContent = rowData;
        button.addEventListener("click",function(){
            selectElement("list1",button);
        })
        cell.appendChild(button);
        row.appendChild(cell);
        table.appendChild(row);
    });
    table.style.width = "95%";
    return table;
}

//date
const startDate = new Date(2024, 3, 30);
const endDate = new Date(2024, 4, 14);

function generateTeachingDate(startDate,endDate){
    let tableBody = document.createElement("table");

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 7)) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        let button = document.createElement("button")
        button.textContent = formatDate(date);
        button.addEventListener("click",function(){
            selectElement("list2",button);
        })
        cell.appendChild(button);
        row.appendChild(cell);


        tableBody.appendChild(row);
    }
    tableBody.style.width = "95%";
    return tableBody;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

//button

function displayFilteredStudents(attendance_header, data) {
    const studentListDiv = document.getElementById("teacher_attendance_data");
    studentListDiv.innerHTML = "";

    const table = document.createElement("table");

    let header_row = document.createElement("tr");
    attendance_header.forEach(function(cellData){
        let header_cell = document.createElement("th");
        header_cell.textContent = cellData;
        header_cell.style.width = "33%";
        header_row.appendChild(header_cell);
    });
    table.appendChild(header_row);

    studentListDiv.appendChild(table);

    data.forEach(function(rowData) {
        let row = document.createElement("tr");
        rowData.slice(1).forEach(function(cellData){
            let cell = document.createElement("td");
            cell.textContent = cellData;
            cell.style.width = "33%";
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    table.style.width = "95%";
}


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
            course[0] === selectedCourse && compareDates(selectedDateStr, course[2]) === 0
        );
    } else if (selectedCourse) {
        temp_attendance_data = attendance_data.filter(course => 
            course[0] === selectedCourse
        );
    } else if (selectedDateStr) {
        temp_attendance_data = attendance_data.filter(course => 
            compareDates(selectedDateStr, course[2]) === 0
        );
    } else {
        temp_attendance_data = attendance_data;
    }

    displayFilteredStudents(attendance_header, temp_attendance_data);
}

// Example compareDates function
function compareDates(dateStr2, dateStr1) {
    // Assuming dateStr1 and dateStr2 are in "dd-mm-yyyy" format
    const [day1, month1, year1] = dateStr1.split(' ')[0].split('-').map(Number);
    const [day2, month2, year2] = dateStr2.split('/').map(Number);

    const date1 = new Date(year1, month1 - 1, day1);
    const date2 = new Date(year2, month2 - 1, day2);
    console.log(date1);
    console.log(date2);
    if (date1.getTime() === date2.getTime()) {
        return 0; // Dates are equal
    } else if (date1 < date2) {
        return -1; // First date is earlier
    } else {
        return 1; // First date is later
    }
}



let teacherCourseData = document.getElementById("teacher_course_data");
teacherCourseData.appendChild(generateTeacherCourseData(teacher_course));

let attendanceData = document.getElementById("teacher_attendance_data");
attendanceData.appendChild(generateAttendanceData(temp_attendance_data,attendance_header));

let teachingDate = document.getElementById("date_table_body");
teachingDate.appendChild(generateTeachingDate(startDate,endDate));