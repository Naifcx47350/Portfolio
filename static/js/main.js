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

  function movePlanets(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  function updateTransformations() {
    var offsetX = (mouseX - centerX) / 30;
    var offsetY = (mouseY - centerY) / 30;

    mainAngle += 0.5;
    mediumAngle += 1;
    smallAngle += 1.5;

    mainPlanet.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${mainAngle}deg)`;
    mediumPlanet.style.transform = `translate(${offsetX * 1.5}px, ${
      offsetY * 1.5
    }px) rotate(${mediumAngle}deg)`;
    smallPlanet.style.transform = `translate(${offsetX * 2}px, ${
      offsetY * 2
    }px) rotate(${smallAngle}deg)`;

    requestAnimationFrame(updateTransformations);
  }

  window.addEventListener("mousemove", movePlanets);
  requestAnimationFrame(updateTransformations);
});

//* Card Roll Over Animation
document.addEventListener("scroll", function () {
  const cards = document.querySelectorAll(".project-item:not(:first-child)");

  cards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;
    const transitionStart = 700;
    const transitionEnd = 220;

    if (cardTop <= transitionStart && cardTop >= transitionEnd) {
      let percentage =
        (cardTop - transitionEnd) / (transitionStart - transitionEnd);
      let brightness = 30 + 70 * (1 - percentage);
      let grayscale = 100 * percentage;
      let scale = 1.01 - 0.01 * (1 - percentage);
      card.style.filter = `brightness(${brightness}%) grayscale(${grayscale}%)`;
      card.style.transform = `scale(${scale})`;
    } else if (cardTop < transitionEnd) {
      card.classList.add("light");
      card.classList.remove("dark");
      card.style.transform = "scale(1)";
    } else {
      card.classList.add("dark");
      card.classList.remove("light");
      card.style.transform = "scale(1.01)";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const projectItems = document.querySelectorAll(".card");

  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    let viewportHeight = window.innerHeight;

    projectItems.forEach((item, index) => {
      let itemTop = item.getBoundingClientRect().top + scrollY;
      let itemBottom = item.getBoundingClientRect().bottom + scrollY;
      let nextItem = projectItems[index + 1];
      let nextItemTop = nextItem
        ? nextItem.getBoundingClientRect().top + scrollY
        : document.body.scrollHeight;

      if (
        scrollY + viewportHeight > itemTop + viewportHeight / 2 &&
        scrollY < nextItemTop - viewportHeight / 2
      ) {
        item.classList.add("focused");
      } else {
        item.classList.remove("focused");
      }
    });
  });
});
document.getElementById("contactButton").addEventListener("click", function () {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

document
  .getElementById("downloadCvButton")
  .addEventListener("click", function () {
    var link = document.createElement("a");
    link.href = "/static/pdf/Naif_Alsahabi_CV.pdf";

    link.download = "Naif_Alsahabi_CV.pdf"; // Suggested filename for download
    // Append the anchor to the body
    document.body.appendChild(link);

    // Programmatically click the anchor
    link.click();

    // Remove the anchor from the body
    document.body.removeChild(link);
  });

//* slider *//
const slider = document.querySelector(".slider");
const track = document.querySelector(".slide-track");
const slides = Array.from(document.querySelectorAll(".slide"));

let slideWidth = slides[0].offsetWidth;
let totalWidth = slideWidth * slides.length;

// Set initial transform to show the first slide
let startIndex = 0;
track.style.transform = `translateX(-${slideWidth * startIndex}px)`;

// Duplicate slides at the end for infinite effect
slides.forEach((slide) => {
  track.appendChild(slide.cloneNode(true));
});

// Function to loop the slider
const loopSlider = () => {
  // Get current transform value
  const currentTransform = track.style.transform.replace(/[^\d.-]/g, "");
  let currentOffset = parseFloat(currentTransform);

  if (currentOffset >= totalWidth - slider.offsetWidth) {
    // Reset to the start when reaching the end
    currentOffset = 0;
    track.style.transition = "none"; // Disable transition for instant reset
    track.style.transform = `translateX(${currentOffset}px)`;

    // Trigger reflow to apply transition removal
    void track.offsetWidth;

    // Re-enable transition
    track.style.transition = "transform 0.5s ease-in-out";
  }

  track.style.transform = `translateX(-${currentOffset + slideWidth}px)`;
};

// Set interval to move slider
let sliderInterval = setInterval(loopSlider, 2000);

// Pause on hover
slider.addEventListener("mouseenter", () => {
  clearInterval(sliderInterval);
});

slider.addEventListener("mouseleave", () => {
  sliderInterval = setInterval(loopSlider, 2000);
});

//* menu button *//
document.querySelector(".menu-button").addEventListener("click", function () {
  document.querySelector("nav ul").classList.toggle("open");
});

document.querySelectorAll("nav ul li a").forEach(function (link) {
  link.addEventListener("click", function () {
    document.querySelector("nav ul").classList.remove("open");
  });
});

document.getElementById("menu-button").addEventListener("click", function () {
  document.body.classList.toggle("menu-active");
  document.getElementById("menu").classList.toggle("active");
});
