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

//* Handle the form submission
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

//* Copy email to clipboard
document.addEventListener("DOMContentLoaded", function () {
  var copyButton = document.getElementById("copy-email-button");

  if (copyButton) {
    copyButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission
      var email = "PNaif4735@gmail.com"; // Replace with your actual email
      var textarea = document.createElement("textarea");
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      // Change the button text and color
      var originalText = copyButton.innerText;
      copyButton.innerText = "Email copied!";
      copyButton.style.backgroundColor = "#6eacda"; // Change button color to green
      copyButton.style.color = "white"; // Ensure text color is white

      // Revert the button text and color after 2 seconds
      setTimeout(function () {
        copyButton.innerText = originalText;
        copyButton.style.backgroundColor = "#333"; // Revert button color to original
        copyButton.style.color = "white"; // Revert text color to original
      }, 2000);
    });
  } else {
    console.log("Copy button not found");
  }
});

//* Interactive Canvas
document.addEventListener("DOMContentLoaded", function () {
  var mainPlanet = document.querySelector(".main-planet");
  var mediumPlanet = document.querySelector(".medium-planet");
  var smallPlanet = document.querySelector(".small-planet");

  var mainAngle = 0;
  var mediumAngle = 0;
  var smallAngle = 0;
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;

  // Function to move the planets based on mouse movement
  function movePlanets(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  // Function to update the transformation of the planets
  function updateTransformations() {
    var offsetX = (mouseX - centerX) / 30;
    var offsetY = (mouseY - centerY) / 30;

    mainAngle += 0.5; // Control the speed of rotation for the main planet
    mediumAngle += 1; // Different speed for medium planet
    smallAngle += 1.5; // Different speed for small planet

    mainPlanet.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${mainAngle}deg)`;
    mediumPlanet.style.transform = `translate(${offsetX * 1.5}px, ${
      offsetY * 1.5
    }px) rotate(${mediumAngle}deg)`;
    smallPlanet.style.transform = `translate(${offsetX * 2}px, ${
      offsetY * 2
    }px) rotate(${smallAngle}deg)`;

    requestAnimationFrame(updateTransformations);
  }

  // Add mousemove event listener to move planets
  window.addEventListener("mousemove", movePlanets);

  // Start the animation
  requestAnimationFrame(updateTransformations);
});
