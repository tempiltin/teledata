const fs = require('fs');
const readline = require('readline');
const path = require('path');

// O‘zbekiston telefon kodlari
const uzbPhoneCodes = [
  '99833', '99855', '99877', '99888', '99890',
  '99891', '99893', '99894', '99895', '99897',
  '99898', '99899'
];

const inputFilePath = path.join(__dirname, 'input.csv');
const outputFilePath = path.join(__dirname, 'uzb_numbers.json');
const readStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity
});
let uzbUsers = [];
rl.on('line', (line) => {
  const parts = line.split('|');
  const user = {
    id: parts[0]?.trim() || null,
    username: parts[5]?.trim() || null,
    phone_number: parts[3]?.trim() || null
  };
  if (user.phone_number) {
    const cleanedNumber = user.phone_number.replace(/[^0-9]/g, ''); // Faqat raqamlar
    const phoneCode = cleanedNumber.substring(0, 5);

    if (uzbPhoneCodes.includes(phoneCode)) {
      uzbUsers.push(user);
    }
  }
});

rl.on('close', () => {
  writeStream.write(JSON.stringify(uzbUsers, null, 2));
  writeStream.end();
  console.log(`O‘zbekiston telefon raqamlari "${outputFilePath}" fayliga muvaffaqiyatli saqlandi.`);
  process.exit(0); 
});
readStream.on('error', (err) => {
  console.error('CSV faylini o‘qishda xatolik yuz berdi:', err);
});
writeStream.on('error', (err) => {
  console.error('JSON faylini yozishda xatolik yuz berdi:', err);
});
