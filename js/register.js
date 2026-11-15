/* ============================================================
   HARMONIX MUSIC ACADEMY — REGISTRATION SCRIPT (register.js)
   Beginner-friendly Vanilla JavaScript for Registration.
   ============================================================ */

// Wait for the HTML document to fully load before running JavaScript
document.addEventListener('DOMContentLoaded', function () {

  // 1. SELECT HTML ELEMENTS USING THEIR IDs
  const registerForm = document.getElementById('registerForm');
  const fullNameInput = document.getElementById('regFullName');
  const emailInput = document.getElementById('regEmail');
  const passwordInput = document.getElementById('regPassword');
  const phoneInput = document.getElementById('regPhone');
  const togglePasswordBtn = document.getElementById('toggleRegPasswordBtn');
  const messageBox = document.getElementById('messageBox');

  // 2. SHOW / HIDE PASSWORD FUNCTIONALITY
  togglePasswordBtn.addEventListener('click', function () {
    // Toggle between password and text type
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordBtn.setAttribute('title', 'Hide password');
    } else {
      passwordInput.type = 'password';
      togglePasswordBtn.setAttribute('title', 'Show password');
    }
  });

  // 3. HELPER FUNCTION: SHOW MESSAGE ON SCREEN
  function showMessage(text, isSuccess) {
    messageBox.textContent = text;

    if (isSuccess) {
      messageBox.className = 'message-box success';
    } else {
      messageBox.className = 'message-box error';
    }

    // Scroll smoothly to the message box
    messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 4. HELPER FUNCTION: VALIDATE BASIC EMAIL FORMAT
  function isValidEmail(email) {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    // Checks that '@' and '.' are present with proper ordering
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  }

  // 5. HELPER FUNCTION: VALIDATE BASIC PHONE NUMBER
  function isValidPhone(phone) {
    // Remove spaces and dashes for checking
    const cleaned = phone.replace(/[\s\-()]/g, '');

    // Check if it contains only digits and has at least 10 numbers
    const isDigitsOnly = /^[0-9+]+$/.test(cleaned);
    return isDigitsOnly && cleaned.length >= 10;
  }

  // 6. FORM SUBMISSION EVENT LISTENER
  registerForm.addEventListener('submit', function (event) {
    // Prevent default form submission and page refresh
    event.preventDefault();

    // Get input values and trim whitespace
    const fullNameValue = fullNameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    // --- VALIDATION STEP 1: Full Name field ---
    if (fullNameValue === '') {
      showMessage('Please enter your full name.', false);
      fullNameInput.focus();
      alert('Validation Error: Full name cannot be empty!');
      return;
    }

    if (fullNameValue.length < 3) {
      showMessage('Full name must be at least 3 characters long.', false);
      fullNameInput.focus();
      alert('Validation Error: Full name must have at least 3 characters!');
      return;
    }

    // --- VALIDATION STEP 2: Email field ---
    if (emailValue === '') {
      showMessage('Please enter your email address.', false);
      emailInput.focus();
      alert('Validation Error: Email address cannot be empty!');
      return;
    }

    if (!isValidEmail(emailValue)) {
      showMessage('Please enter a valid email format (e.g. name@example.com).', false);
      emailInput.focus();
      alert('Validation Error: Invalid email format!');
      return;
    }

    // --- VALIDATION STEP 3: Password field ---
    if (passwordValue === '') {
      showMessage('Please enter a password.', false);
      passwordInput.focus();
      alert('Validation Error: Password cannot be empty!');
      return;
    }

    if (passwordValue.length < 6) {
      showMessage('Password must be at least 6 characters long.', false);
      passwordInput.focus();
      alert('Validation Error: Password must be at least 6 characters long!');
      return;
    }

    // --- VALIDATION STEP 4: Phone Number field ---
    if (phoneValue === '') {
      showMessage('Please enter your phone number.', false);
      phoneInput.focus();
      alert('Validation Error: Phone number cannot be empty!');
      return;
    }

    if (!isValidPhone(phoneValue)) {
      showMessage('Please enter a valid phone number (at least 10 digits).', false);
      phoneInput.focus();
      alert('Validation Error: Please enter a valid 10-digit phone number!');
      return;
    }

    // --- SUCCESS: All validation checks passed! ---
    showMessage('Registration successful! Redirecting to login...', true);
    alert('Success: Registration successful! You can now log in.');

    // Clear form inputs
    registerForm.reset();

    // Redirect to login page after 1.5 seconds
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1500);

  });

});
