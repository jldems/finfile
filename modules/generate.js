const fs = require("fs");

// the file name and content
const fileName = process.argv[2];
const content = process.argv[3];

// write the content to the file
fs.writeFile(fileName, content, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`JavaScript file "${fileName}" has been created!`);

  // add a <script> tag to the HTML file with the location of the generated JavaScript file
  const htmlFileName = process.argv[4];
  const scriptTag = `<script src="${fileName}"></script>\n`;
  fs.appendFile(htmlFileName, scriptTag, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`"${scriptTag}" has been added to "${htmlFileName}"`);
  });
});
    