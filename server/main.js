import fs from "fs";

function imageToBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const base64String = imageBuffer.toString("base64");

    console.log(base64String);

    const cleanBase64 = base64String.replace(/\s/g, "");

    console.log(cleanBase64);
  } catch (error) {
    console.error("Error converting image to base64:", error.message);
    return null;
  }
}

function main() {
  const imagePath = "./battery.jpg";
  // const imagePath = "./capet1.jpg";
  imageToBase64(imagePath);
}

main();
