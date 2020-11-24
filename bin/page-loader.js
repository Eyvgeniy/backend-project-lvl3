#!/usr/bin/env node

import pageLoader from '../src/index.js';

const url = process.argv[process.argv.length - 1];
const filePath = async () => {
  const filePath = await pageLoader(url);
  console.log(filePath);
};
filePath();
