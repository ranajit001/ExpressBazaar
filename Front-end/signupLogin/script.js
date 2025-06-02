import { API_BASE_URL } from "../baseurl.js";

// API endpoints
const buyerSignup = `${API_BASE_URL}/signup`;
const buyerLogin = `${API_BASE_URL}/login`;
const sellerSignup = `${API_BASE_URL}/seller/signup`;
const sellerLogin = `${API_BASE_URL}/seller/login`;

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const tabs = document.querySelectorAll(".tab");
const userInfo = document.querySelector('.user-info');
const userEmailElement = document.getElementById('userEmail');
const userNameElement = document.getElementById('userName');
const mainContainer = document.querySelector('.main-container');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardBtn = document.getElementById('dashboardBtn');

// Helper Functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const activeForm = document.querySelector('form.active');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    
    messageDiv.style.display = 'block';
    setTimeout(() => messageDiv.remove(), 3000);
}

function showLoading(form, show) {
    const spinner = form.querySelector('.loading-spinner');
    if (!spinner) {
        const newSpinner = document.createElement('div');
        newSpinner.className = 'loading-spinner';
        form.querySelector('button[type="submit"]').before(newSpinner);
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = show;
    spinner ? spinner.style.display = show ? 'block' : 'none' : null;
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');

    if (token) {
        mainContainer.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmailElement.textContent = storedEmail;
        userNameElement.textContent = `${storedName} (${userType})`;

        // Show dashboard button only for sellers
        if (userType === 'seller') {
            dashboardBtn.style.display = 'inline-block';
            dashboardBtn.addEventListener('click', () => {
                window.location.href = '../SellerDashBoard/Dashboard/deshboard.html';
            });
        } else {
            dashboardBtn.style.display = 'none';
        }
    } else {
        mainContainer.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Event Listeners
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const isLogin = tab.textContent === "Login";
        loginForm.classList.toggle("active", isLogin);
        signupForm.classList.toggle("active", !isLogin);
        
        // Clear any existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
    });
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const userType = document.getElementById("loginUserType").value;

    try {
        showLoading(loginForm, true);
        let response;

        if(userType === 'seller') {
            response = await fetch(sellerLogin, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, userType })
            });
        } else {
            response = await fetch(buyerLogin, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, userType })
            });
        }

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", data.name || email);
            localStorage.setItem("userType", userType);
            
            showMessage("Login successful!", "success");
            checkLoginStatus();
            
            // Redirect after success message
            setTimeout(() => {
                window.location.href = '../home Page/index.html';
            }, 1500);
        } else {
            showMessage(data.message || "Login failed!", "error");
        }
    } catch (error) {
        console.error("Login Error:", error);
        showMessage("An error occurred during login.", "error");
    } finally {
        showLoading(loginForm, false);
    }
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const userType = document.getElementById("signupUserType").value;

    try {
        showLoading(signupForm, true);
        let response;

        if(userType === 'seller') {
            response = await fetch(sellerSignup, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, userType })
            });
        } else {
            response = await fetch(buyerSignup, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, userType })
            });
        }

        const data = await response.json();
        
        if (response.ok) {
            showMessage("Signup successful! Please login.", "success");
            setTimeout(() => {
                // Switch to login form after successful signup
                tabs[0].click();
                signupForm.reset();
            }, 1500);
        } else {
            showMessage(data.message || "Signup failed!", "error");
        }
    } catch (error) {
        console.error("Signup Error:", error);
        showMessage("An error occurred during signup.", "error");
    } finally {
        showLoading(signupForm, false);
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    checkLoginStatus();
    window.location.reload();
});

// Initialize page
document.addEventListener('DOMContentLoaded', checkLoginStatus);

