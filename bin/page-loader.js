#!/usr/bin/env node
import program from 'commander';
import load from '../src/index.js';

const handleError = (e) => {
  if (e.response) {
    const { url } = e.config;
    return `${e.response.statusText}: ${url}. ${e.message}.`;
  }
  return e.message;
};

program
  .description('Download pages on local machine.')
  .version('1.0.0')
  .arguments('<url>')
  .option('-o, --output [path]', 'Output directory to load content')
  .action((url) => {
    load(url, program.output = process.cwd())
      .then(({ path }) => {
        console.log(`All resources from ${url} were successfully downloaded.`);
        console.log(`You can open ${path}`);
      })
      .catch((err) => {
        console.error(handleError(err));
        process.exit(1);
      });
  });
program.parse(process.argv);
