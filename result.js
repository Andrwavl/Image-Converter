document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const transformationOption = params.get("transformation");

  const image = new Image();
  image.src = localStorage.getItem("uploadedImage");

  image.onload = function () {
    const originalCanvas = document.getElementById("original-canvas");
    const transformedCanvas = document.getElementById("transformed-canvas");
    originalCanvas.width = transformedCanvas.width = image.width;
    originalCanvas.height = transformedCanvas.height = image.height;

    const originalCtx = originalCanvas.getContext("2d");
    const transformedCtx = transformedCanvas.getContext("2d");

    originalCtx.drawImage(image, 0, 0);

    const imageData = originalCtx.getImageData(0, 0, image.width, image.height);
    const transformedData = transformedCtx.createImageData(imageData);

    if (transformationOption === "grayscale") {
      applyGrayscale(imageData, transformedData);
    } else if (transformationOption === "blur") {
      applyBlur(imageData, transformedData, image.width, image.height);
    }

    transformedCtx.putImageData(transformedData, 0, 0);
  };

  function applyGrayscale(input, output) {
    for (let i = 0; i < input.data.length; i += 4) {
      const r = input.data[i];
      const g = input.data[i + 1];
      const b = input.data[i + 2];
      const gray = 0.3 * r + 0.59 * g + 0.11 * b;

      output.data[i] = gray;
      output.data[i + 1] = gray;
      output.data[i + 2] = gray;
      output.data[i + 3] = input.data[i + 3];
    }
  }

  function applyBlur(input, output, width, height) {
    const kernelSize = 7;
    const kernelRadius = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0;

        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
          for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
            const px = x + kx;
            const py = y + ky;

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const idx = (py * width + px) * 4;
              r += input.data[idx];
              g += input.data[idx + 1];
              b += input.data[idx + 2];
              count++;
            }
          }
        }

        const idx = (y * width + x) * 4;
        output.data[idx] = r / count;
        output.data[idx + 1] = g / count;
        output.data[idx + 2] = b / count;
        output.data[idx + 3] = input.data[idx + 3];
      }
    }
  }
});
