const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(__dirname + '/text.txt', {
  flags: 'a',
});

console.log(
  'Welcome! Please enter some text. Type "exit" or press "ctrl + c" to quit.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    process.exit(0);
  } else {
    writeStream.write(input + '\n');
    console.log(
      'Text saved! You can continue typing. Remember, type "exit" or press "ctrl + c" to quit.',
    );
  }
});

process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});
