// main.js

// Get the modal
var modal = document.getElementById("email-popup");

// Get the button that opens the modal
var btn = document.getElementById("email-icon");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle the form submission
document.getElementById("email-form").onsubmit = function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Collect form data
  var email = document.getElementById("user-email").value;
  var subject = document.getElementById("subject").value;
  var message = document.getElementById("message").value;

  // Send the email
  fetch("/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      subject: subject,
      message: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    })
    .catch((error) => console.error("Error:", error));

  // Close the modal
  modal.style.display = "none";
};

// Copy email to clipboard
// Copy email to clipboard
document.getElementById("copy-email-button").onclick = function (event) {
  event.preventDefault(); // Prevent form submission
  var email = "PNaif4735@gmail.com"; // Replace with your actual email
  var textarea = document.createElement("textarea");
  textarea.value = email;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  // Show the tooltip
  var tooltip = document.getElementById("tooltip");
  tooltip.classList.add("show");

  // Hide the tooltip after 2 seconds
  setTimeout(function () {
    tooltip.classList.remove("show");
  }, 2000);
};
