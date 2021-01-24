import axios from 'axios';
import 'axios-debug-log';
import debug from 'debug';
import Listr from 'listr';
import { parseRootName, addRootExt, parseResourseName } from './utils/index.js';
import replaceLinks from './parseHtml.js';
import * as fs from './utils/fs.js';

const log = debug('page-loader');

const savePage = (dir, url) => {
  const { fileName } = parseRootName(url);
  const { htmlName, dirName } = addRootExt(fileName);
  const htmlPath = fs.getPath(dir, htmlName);
  const dirPath = fs.getPath(dir, dirName);
  let allLinks;
  let savedHtml;
  let resoursePath;
  log(`dirname: ${dirName}`);
  log(`dirpath: ${dirPath}`);
  log(`filename: ${fileName}`);
  log(`filepath: ${htmlPath}`);

  const buildPromise = (link) => {
    let responseData;
    const resourseName = parseResourseName(link);
    resoursePath = fs.getPath(dirPath, resourseName);
    return axios
      .get(link, { responseType: 'arraybuffer' })
      .then(({ data }) => {
        responseData = data;
        return fs.mkdir(dirPath);
      })
      .then(() => fs.writeFile(resoursePath, responseData));
  };

  return fs
    .access(dir)
    .then(() => axios.get(url))
    .then(({ data }) => {
      console.log(data);
      const { links, html } = replaceLinks(data, dirName, url);
      allLinks = links;
      savedHtml = html;
      log(`Remote resourses:\n${allLinks.join('\n')}`);
      return fs.writeFile(htmlPath, html);
    })
    .then(() => {
      const promiseLinks = new Listr(
        allLinks.map((link) => ({ title: link, task: () => buildPromise(link) }))
      );
      return promiseLinks.run();
    })
    .then(() => ({ path: dirPath, html: savedHtml }));
};

export default savePage;
