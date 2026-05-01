const fs = require('fs/promises');
const path = require('path');

const productsFilePath = path.resolve(__dirname, '../..', 'src', 'assets', 'data', 'products.json');

async function getProducts() {
  const rawData = await fs.readFile(productsFilePath, 'utf8');
  return JSON.parse(rawData);
}

module.exports = {
  getProducts,
};
