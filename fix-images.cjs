const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'lib', 'partsData.js');
let content = fs.readFileSync(file, 'utf8');

// Replace all media.db.com image URLs with a generic car engine placeholder from Unsplash
content = content.replace(/https:\/\/media\.db\.com\/images\/public\/[a-zA-Z0-9_./-]+/g, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop');

fs.writeFileSync(file, content, 'utf8');
console.log('Images replaced!');
