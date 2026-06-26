const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy the artifacts
const artifactDir = 'C:\\Users\\neth.CVC.001\\.gemini\\antigravity\\brain\\c7c8fd1f-5d7a-4c3f-b5d7-36f3f6c29a4e';
const files = {
  'rs6_car': 'rs6_car_1782492099316.png',
  'rs6_c7': 'rs6_c7_1782492109247.png',
  'v8_engine': 'v8_engine_1782492119143.png',
  'ceramic_brakes': 'ceramic_brakes_1782492128994.png',
  'matrix_led': 'matrix_led_1782492140776.png',
  'drivetrain': 'drivetrain_1782492152271.png'
};

for (const [key, filename] of Object.entries(files)) {
  const src = path.join(artifactDir, filename);
  const dest = path.join(publicImagesDir, `${key}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${filename} to public/images/${key}.png`);
  } else {
    console.log(`Source not found: ${src}`);
  }
}

// Now rewrite partsData.js to use these images instead of unsplash
const dataFile = path.join(__dirname, 'src', 'lib', 'partsData.js');
let data = fs.readFileSync(dataFile, 'utf8');

// Replace hero images
data = data.replace(
  /export const heroImages = {[\s\S]*?};/,
  `export const heroImages = {
  C8: "./images/rs6_car.png",
  C7: "./images/rs6_c7.png",
  C6: "./images/rs6_c7.png", // Fallback to c7
  C5: "./images/rs6_c7.png", // Fallback to c7
};`
);

// We need to replace frames for engine, brakes, etc.
// Unsplash URL is https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop
const unsplash = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop";

// We will do a regex replacement based on category or id
data = data.replace(/id: "v8-engine"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/v8_engine.png", "./images/v8_engine.png", "./images/v8_engine.png", "./images/v8_engine.png"],`);
});
data = data.replace(/id: "v10-engine"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/v8_engine.png", "./images/v8_engine.png", "./images/v8_engine.png", "./images/v8_engine.png"],`);
});

data = data.replace(/id: "ceramic-brakes"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/ceramic_brakes.png", "./images/ceramic_brakes.png", "./images/ceramic_brakes.png", "./images/ceramic_brakes.png"],`);
});

data = data.replace(/id: "matrix-led"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/matrix_led.png", "./images/matrix_led.png", "./images/matrix_led.png", "./images/matrix_led.png"],`);
});
data = data.replace(/id: "xenon-lights"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/matrix_led.png", "./images/matrix_led.png", "./images/matrix_led.png", "./images/matrix_led.png"],`);
});

data = data.replace(/id: "quattro-diff"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/drivetrain.png", "./images/drivetrain.png", "./images/drivetrain.png", "./images/drivetrain.png"],`);
});

// For the rest, we leave the unsplash placeholder or use one of the ones we have.
// Exhaust -> drivetrain (close enough mechanically)
data = data.replace(/id: "exhaust"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/drivetrain.png", "./images/drivetrain.png", "./images/drivetrain.png", "./images/drivetrain.png"],`);
});

// Air suspension -> brakes (close enough mechanically)
data = data.replace(/id: "air-suspension"[\s\S]*?frames: \[\s*".*?"[\s\S]*?\],/g, (match) => {
  return match.replace(/frames: \[\s*".*?"[\s\S]*?\],/, `frames: ["./images/ceramic_brakes.png", "./images/ceramic_brakes.png", "./images/ceramic_brakes.png", "./images/ceramic_brakes.png"],`);
});

fs.writeFileSync(dataFile, data, 'utf8');
console.log('partsData.js updated successfully!');
