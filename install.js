
const fs = require('fs');
const readline = require('readline');
const mkdir = require('mkdir');
const sha256 = require('sha256');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let result = '';
rl.question('Which port to use to start the server?\nport:', (port) => {
  result += `port: ${port}`;
  result += '\n';
  rl.question('Which folder to use to storing date(in format /home/kudrya/Documents or D:/Doc/)?\npath:', (path) => {
    result += `database: ${path}`;
    result += '\n';
    rl.question('Password:', (password) => {
      result += 'files: tmp\n';
      mkdir.mkdirsSync(`${path}/tmp`);
      result += `password: ${sha256(password)}`;
      result += '\n';
      fs.writeFileSync('configuration.yml', result);
      rl.close();
      console.log('Success');
    });
  });
});