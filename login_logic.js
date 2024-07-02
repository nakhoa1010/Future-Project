let users = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('loginData.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            users = data;
        })
        .catch(error => console.error('Error fetching user data:', error));
});

function validateLogin(username, password) {
    const user = users.find(u => u.userID === username && u.pwd === password);
    let role = null;
    if (user) {
        role = user.role == 0 ? "student" : "teacher";
    }
    return [!!user, role, user];
}

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("student_id").value;
    const password = document.getElementById("student_password").value;

    const [isValid, role, user] = validateLogin(username, password);

    const loginStatus = document.getElementById("login-status");
    if (isValid) {
        if (user && user.userID) {
            localStorage.setItem('loggedInUserID', user.userID);
            loginStatus.textContent = "Login successful!";
            setTimeout(function() {
                if (role === "student") {
                    window.location.href = "student_info.html";
                } else {
                    window.location.href = "teacher_info.html";
                }
            }, 1000); // Changed delay to 1 second for a faster transition
        } else {
            loginStatus.textContent = "Error: User ID not found.";
        }
    } else {
        loginStatus.textContent = "Invalid username or password. Please try again.";
    }
});
