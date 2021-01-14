// takes url as cmd line argument and local file path and download the resource to the specified path (path is an arg)
let fs = require('fs');
let readline = require('readline');
let args = process.argv.splice(2);
let url = args[0];
let savePath = args[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const request = require('request');
request(url, (error, response, body) => {
  console.log("statusCode: ", response && response.statusCode);

  if (error || response.statusCode !== 200) {
    console.log("An error has occured", error);
    console.log("Exiting Program.");
    //needs return and close to actually stop program??
    rl.close();
    return;
  }

  if (fs.existsSync(savePath)) {
    rl.question('File already exists. Overwrite? (Y/N)', (answer) => {
      let regex = /y|yes/i;
      if (answer.search(regex) >= 0) {
        fs.writeFile(savePath, body, 'utf8', () => {
          let size = fs.statSync(savePath).size;
          console.log(`Downloaded and saved ${size} bytes to ${savePath}`);
          rl.close();
        });
      } else {
        console.log("File not saved");
        rl.close();
      }
    });
  } else {
    fs.writeFile(savePath, body, 'utf8', (e) => {

      if (e) {
        console.log("File path invalid. Exiting Program");
      } else {
        let size = fs.statSync(savePath).size;
        console.log(`Downloaded and saved ${size} bytes to ${savePath}`);
      }
      rl.close();
    });
  }

  rl.on('close', () => {
    process.exit;
  });

});

