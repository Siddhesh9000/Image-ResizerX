document.addEventListener("DOMContentLoaded", function () {
  let resizedImages = [];

  document
    .getElementById("image-input")
    .addEventListener("change", handleFileSelect);

  document
    .getElementById("resize-button-instagram")
    .addEventListener("click", () => resizeImage(1080, 1080));
  document
    .getElementById("resize-button-linkedin")
    .addEventListener("click", () => resizeImage(1200, 627));
  document
    .getElementById("resize-button-twitter")
    .addEventListener("click", () => resizeImage(1200, 675));
  document
    .getElementById("resize-button-website")
    .addEventListener("click", () => resizeImage(600, 300));
  document
    .getElementById("resize-button-custom")
    .addEventListener("click", handleCustomResize);
  document
    .getElementById("download-button")
    .addEventListener("click", handleDownload);

  function handleFileSelect(event) {
    const imageContainer = document.getElementById("image-container");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressText = document.getElementById("progress-text");
    const files = event.target.files;

    if (files.length > 0) {
      imageContainer.classList.remove("hidden");
      imageContainer.classList.add("opacity-100");

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
        uploadedImage.src = URL.createObjectURL(file);

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("cancel-button");
        cancelButton.innerText = "X";
        cancelButton.addEventListener("click", () => {
          uploadedImageContainer.remove();
          updateProgressBarOnCancel();
        });

        uploadedImageContainer.appendChild(uploadedImage);
        uploadedImageContainer.appendChild(cancelButton);
        imageContainer.appendChild(uploadedImageContainer);
      });

      simulateProgress();
    } else {
      imageContainer.classList.add("hidden");
      resetProgress();
    }
  }

  function handleCustomResize() {
    const width = parseInt(document.getElementById("custom-width").value);
    const height = parseInt(document.getElementById("custom-height").value);

    if (width > 0 && height > 0) {
      resizeImage(width, height);
    } else {
      alert("Please enter valid width and height values");
    }
  }

  function resizeImage(width, height) {
    const uploadedImages = document.querySelectorAll(".uploaded-image");

    uploadedImages.forEach((uploadedImage) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = uploadedImage.src;

      img.onload = function () {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageData = canvas.toDataURL("image/jpeg");
        resizedImages.push(resizedImageData);
        uploadedImage.src = resizedImageData;
      };
    });
  }

  function handleDownload() {
    if (resizedImages.length === 0) {
      alert("Please resize the image before downloading.");
      return;
    }

    const selectedFormat = document.getElementById("image-format").value;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    resizedImages.forEach((resizedImageData, index) => {
      const img = new Image();
      img.src = resizedImageData;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageUrl = canvas.toDataURL(`image/${selectedFormat}`);
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `resized-image-${index + 1}.${selectedFormat}`;
        link.click();
      };
    });
  }

  function simulateProgress() {
    const imageContainer = document.getElementById("image-container");
    const uploadedImages = document.querySelectorAll(".uploaded-image");

    // Only simulate progress if there are images to process
    if (uploadedImages.length > 0) {
      let currentPercentage = 0;
      const progressBarFill = document.getElementById("progress-bar-fill");
      const progressText = document.getElementById("progress-text");

      const progressInterval = setInterval(() => {
        if (currentPercentage < 100) {
          currentPercentage += 5;
          updateProgress(currentPercentage);
        } else {
          clearInterval(progressInterval);
        }
      }, 100);
    }
  }

  function updateProgress(progress) {
    const progressBar = document.getElementById("progress-bar-fill");
    const progressText = document.getElementById("progress-text");

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Uploaded: ${progress}%`;

    if (progress <= 30) {
      progressBar.className = "progress-bar-fill bg-red-500";
    } else if (progress <= 60) {
      progressBar.className = "progress-bar-fill bg-yellow-500";
    } else {
      progressBar.className = "progress-bar-fill bg-green-500";
    }
  }

  function resetProgress() {
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressText = document.getElementById("progress-text");

    progressBarFill.style.width = "0%";
    progressText.textContent = "Uploaded: 0%";
    updateProgress(0);
  }

  function updateProgressBarOnCancel() {
    const uploadedImages = document.querySelectorAll(".uploaded-image");

    if (uploadedImages.length === 0) {
      resetProgress(); // Reset progress if no images are left
    } else {
      const progressPercentage = Math.round(
        (uploadedImages.length / uploadedImages.length) * 100
      );
      updateProgress(progressPercentage);
    }
  }
});
