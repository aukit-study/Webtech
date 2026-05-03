const fs = require('fs/promises');
const path = require('path');

const productsFilePath = path.resolve(__dirname, '../..', 'src', 'assets', 'data', 'products.json');

async function getProducts(category) {
  const rawData = await fs.readFile(productsFilePath, 'utf8');
  const products = JSON.parse(rawData);

  if (!category) {
    return products;
  }

  const normalizedCategory = String(category).trim().toLowerCase();
  return products.filter((product) => {
    return String(product.category || '').trim().toLowerCase() === normalizedCategory;
  });
}

module.exports = {
  getProducts,
};
