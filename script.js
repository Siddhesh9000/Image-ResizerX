document.addEventListener("DOMContentLoaded", function () {
  let resizedImages = []; // To hold the resized images' data

  // Handle file selection and displaying images
  document
    .getElementById("image-input")
    .addEventListener("change", function () {
      const imageContainer = document.getElementById("image-container");
      const progressBarFill = document.getElementById("progress-bar-fill");
      const progressText = document.getElementById("progress-text");
      const files = this.files;

      if (files.length > 0) {
        let currentPercentage = 0;

        // Show the container once files are selected
        imageContainer.classList.remove("hidden");
        imageContainer.classList.add("opacity-100");

        // Create a preview for each selected file
        Array.from(files).forEach((file) => {
          const uploadedImageContainer = document.createElement("div");
          uploadedImageContainer.classList.add("uploaded-image-container");

          const uploadedImage = document.createElement("img");
          uploadedImage.classList.add(
            "uploaded-image",
            "w-full",
            "rounded-lg",
            "shadow-md",
            "h-auto"
          );
          uploadedImage.src = URL.createObjectURL(file); // Generate URL for the uploaded image

          // Create the "X" cancel button
          const cancelButton = document.createElement("button");
          cancelButton.classList.add("cancel-button");
          cancelButton.innerText = "X";
          cancelButton.addEventListener("click", function () {
            uploadedImageContainer.remove(); // Remove the image container
          });

          // Append image and cancel button to the container
          uploadedImageContainer.appendChild(uploadedImage);
          uploadedImageContainer.appendChild(cancelButton);
          imageContainer.appendChild(uploadedImageContainer); // Append to the container without clearing the container
        });

        const progressInterval = setInterval(() => {
          if (currentPercentage < 100) {
            currentPercentage += 5; // Increase percentage
            progressBarFill.style.width = `${currentPercentage}%`;
            progressText.textContent = `Uploaded: ${currentPercentage}%`;
            updateProgress(currentPercentage);
          } else {
            clearInterval(progressInterval); // Stop progress bar when 100%
          }
        }, 100);
      } else {
        // If no files are selected, hide the image container
        imageContainer.classList.add("hidden");
        progressBarFill.style.width = "0%";
        progressText.textContent = "Uploaded: 0%";
        updateProgress(0);
      }
    });

  // Function to resize the image to specific dimensions when a button is clicked
  document
    .getElementById("resize-button-instagram")
    .addEventListener("click", function () {
      resizeImage(1080, 1080);
    });

  document
    .getElementById("resize-button-facebook")
    .addEventListener("click", function () {
      resizeImage(1200, 630);
    });

  document
    .getElementById("resize-button-twitter")
    .addEventListener("click", function () {
      resizeImage(1200, 675);
    });

  document
    .getElementById("resize-button-website")
    .addEventListener("click", function () {
      resizeImage(600, 300);
    });

  // Function to resize the image
  function resizeImage(width, height) {
    const uploadedImages = document.querySelectorAll(".uploaded-image");

    uploadedImages.forEach((uploadedImage) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = uploadedImage.src;

      img.onload = function () {
        // Set canvas size to new width and height
        canvas.width = width;
        canvas.height = height;

        // Draw the resized image onto the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Save the resized image data
        resizedImages.push(canvas.toDataURL("image/jpeg")); // Store as JPEG or whatever format is needed

        // Update the displayed image with the resized version
        uploadedImage.src = resizedImages[resizedImages.length - 1];
      };
    });
  }

  // Function to change the color of the progress bar based on the progress percentage
  function updateProgress(progress) {
    const progressBar = document.getElementById("progress-bar-fill");

    // Change color based on progress
    if (progress <= 30) {
      progressBar.className = "progress-bar-fill bg-red-500"; // Red for low progress
    } else if (progress <= 60) {
      progressBar.className = "progress-bar-fill bg-yellow-500"; // Yellow for moderate progress
    } else {
      progressBar.className = "progress-bar-fill bg-green-500"; // Green for high progress
    }
  }

  // Function to handle the download functionality
  document
    .getElementById("download-button")
    .addEventListener("click", function () {
      if (resizedImages.length > 0) {
        const selectedFormat = document.getElementById("image-format").value; // Get the selected format
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        resizedImages.forEach((resizedImageData, index) => {
          const img = new Image();
          img.src = resizedImageData;

          img.onload = function () {
            // Set canvas size to resized image's width and height
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the resized image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Create the downloadable image URL based on the selected format
            let imageUrl;
            if (selectedFormat === "jpeg") {
              imageUrl = canvas.toDataURL("image/jpeg"); // Convert to JPEG
            } else if (selectedFormat === "png") {
              imageUrl = canvas.toDataURL("image/png"); // Convert to PNG
            } else if (selectedFormat === "webp") {
              imageUrl = canvas.toDataURL("image/webp"); // Convert to WebP
            }

            // Create an anchor element and trigger the download
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = `resized-image-${index + 1}.${selectedFormat}`; // Set filename with the selected format
            link.click(); // Trigger the download
          };
        });
      } else {
        alert("Please resize the image before downloading.");
      }
    });
});
