/* ============================================================
   HARMONIX MUSIC ACADEMY — LOGIN SCRIPT (login.js)
   Beginner-friendly Vanilla JavaScript for Login functionality.
   ============================================================ */

// Wait for the HTML document to fully load before running JavaScript
document.addEventListener('DOMContentLoaded', function () {

  // 1. SELECT HTML ELEMENTS USING THEIR IDs
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const messageBox = document.getElementById('messageBox');

  // 2. SHOW / HIDE PASSWORD FUNCTIONALITY
  // When user clicks the eye icon button, toggle password visibility
  togglePasswordBtn.addEventListener('click', function () {
    // If input is currently password, change to text (visible)
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePasswordBtn.setAttribute('title', 'Hide password');
    } else {
      // Otherwise, change back to password (hidden)
      passwordInput.type = 'password';
      togglePasswordBtn.setAttribute('title', 'Show password');
    }
  });

  // 3. HELPER FUNCTION: SHOW MESSAGE ON SCREEN AND OPTIONAL ALERT
  function showMessage(text, isSuccess) {
    messageBox.textContent = text;
    
    if (isSuccess) {
      messageBox.className = 'message-box success';
    } else {
      messageBox.className = 'message-box error';
    }

    // Scroll smoothly to the message box so the user sees it immediately
    messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 4. HELPER FUNCTION: VALIDATE BASIC EMAIL FORMAT
  // Checks if the string contains '@' and a dot '.' after it
  function isValidEmail(email) {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    // Valid if '@' exists, '.' exists after '@', and there are letters before/after
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  }

  // 5. FORM SUBMISSION EVENT LISTENER
  loginForm.addEventListener('submit', function (event) {
    // Prevent the default browser reload on form submission
    event.preventDefault();

    // Get trimmed values from the input fields
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // --- VALIDATION STEP 1: Check for empty fields ---
    if (emailValue === '') {
      showMessage('Please enter your email address.', false);
      emailInput.focus();
      alert('Validation Error: Email field cannot be empty!');
      return;
    }

    // --- VALIDATION STEP 2: Validate basic email format ---
    if (!isValidEmail(emailValue)) {
      showMessage('Please enter a valid email address (e.g. name@example.com).', false);
      emailInput.focus();
      alert('Validation Error: Please enter a valid email format!');
      return;
    }

    // --- VALIDATION STEP 3: Check for empty password ---
    if (passwordValue === '') {
      showMessage('Please enter your password.', false);
      passwordInput.focus();
      alert('Validation Error: Password field cannot be empty!');
      return;
    }

    // --- VALIDATION STEP 4: Check password minimum length ---
    if (passwordValue.length < 6) {
      showMessage('Password must be at least 6 characters long.', false);
      passwordInput.focus();
      alert('Validation Error: Password must be at least 6 characters long!');
      return;
    }

    // --- SUCCESS: All validation checks passed! ---
    showMessage('Login successful! Welcome back to Harmonix Academy.', true);
    alert('Success: Login successful! Welcome back.');

    // Optional beginner-friendly redirection to homepage after 1 second
    setTimeout(function () {
      window.location.href = '../index.html';
    }, 1200);

  });

});
