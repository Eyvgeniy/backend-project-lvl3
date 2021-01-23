#!/usr/bin/env node

import pageLoader from '../src/index.js';

const url = process.argv[process.argv.length - 1];
const savePage = async () => {
  const filePath = await pageLoader(url);
  console.log(filePath);
};
savePage();
