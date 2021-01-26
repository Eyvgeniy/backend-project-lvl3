import fs from 'fs/promises';
import path from 'path'
import axios from 'axios';
import 'axios-debug-log';
import debug from 'debug';
import Listr from 'listr';
import { parseRootName, addRootExt, parseResourseName } from './utils/index.js';
import replaceLinks from './parseHtml.js';

const log = debug('page-loader');

const getPath = (dir, filename) => path.join(dir, filename);

const savePage = (url, dir) => {
  const { fileName } = parseRootName(url);
  const { htmlName, dirName } = addRootExt(fileName);
  const htmlPath = getPath(dir, htmlName);
  const dirPath = getPath(dir, dirName);
  let allLinks;
  let savedHtml;
  log(`dirname: ${dirName}`);
  log(`dirpath: ${dirPath}`);
  log(`filename: ${fileName}`);
  log(`filepath: ${htmlPath}`);

  const buildPromise = (link) => {
    const resourseName = parseResourseName(link);
    const resoursePath = getPath(dirPath, resourseName);
    return axios
      .get(link, { responseType: 'arraybuffer' })
      .then(({ data }) => {
        return fs.writeFile(resoursePath, data);
      })
  };

  return fs
    .access(dir)
    .then(() => axios.get(url))
    .then(({ data }) => {
      const { links, html } = replaceLinks(data, dirName, url);
      allLinks = links;
      savedHtml = html;
      log(`Remote resourses:\n${allLinks.join('\n')}`);
      return fs.writeFile(htmlPath, html);
    })
    .then(() => fs.mkdir(dirPath))
    .then(() => {
      const promiseLinks = allLinks
        .map((link) => ({title: link, task: () => buildPromise(link)}));
      return new Listr(promiseLinks, { concurrent: true, exitOnError: false }).run();
    })
    .then(() => ({ path: dirPath, html: savedHtml }));
};

export default savePage;
