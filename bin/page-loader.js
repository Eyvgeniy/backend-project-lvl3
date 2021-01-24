#!/usr/bin/env node

import pageLoader from '../src/index.js';

const url = process.argv[process.argv.length - 1];
const savePage = async () => {
  pageLoader(url)
    .then((data) => console.log(data))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
savePage();
