const users = [
    { username: "user1", password: "password1", role: "student" },
    { username: "user2", password: "password2", role: "teacher" }
];

function validateLogin(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    var role = null;
    if (user)
        if (users.find(u => u.username === username && u.password === password && u.role === "student"))
            role = "student";
        else
            role = "teacher";
    return [user !== undefined, role ? role : null];
}

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("student_id").value;
    const password = document.getElementById("student_password").value;

    const isValid = validateLogin(username, password);

    const loginStatus = document.getElementById("login-status");
    if (isValid[0]) {
        loginStatus.textContent = "Login successful!";
        setTimeout(function () {
            if (isValid[1] == "student")
                window.location.href = "student_info.html";
            else
                window.location.href = "teacher_info.html";
        }, 3000)
    } else {
        loginStatus.textContent = "Invalid username or password. Please try again.";
    }
});