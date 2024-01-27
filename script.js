function performOCR() {
    const imageInput = document.getElementById("image-input");
    const imagePreview = document.getElementById("image-preview");
    const output = document.getElementById("output");
  

    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
        Tesseract.recognize(e.target.result,'eng+hin')
          .then(function (result) {
            output.textContent = result.data.text;
          })
          .catch(function (error) {
            console.error("Error:", error);
          });d
      };
  
      reader.readAsDataURL(imageInput.files[0]);
    }
  } 
function camera(){       
  
          const video = document.querySelector("#videoElement");
          const captureButton = document.querySelector("#captureButton");
          const resultDiv = document.querySelector("#result");
  
         
          navigator.mediaDevices.getUserMedia({ video: true })
              .then(stream => {
                  video.srcObject = stream;
              })
              .catch(error => {
                  console.error("Error accessing the camera: ", error);
              });
  

          function captureAndOCR() {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  
          
              const imageDataURL = canvas.toDataURL("image/png");
  

              fetch("/process-image", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ image: imageDataURL })
              })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      resultDiv.textContent = data.text;
                  } else {
                      console.error("OCR processing failed: ", data.error);
                  }
              })
              .catch(error => {
                  console.error("Error sending the image for OCR processing: ", error);
              });
          }
  

          captureButton.addEventListener("click", captureAndOCR);
        }