import axios from 'axios';
import { parseRootName, addRootExt, parseResourseName } from './utils/index.js';
import replaceLinks from './parseHtml';
import * as fs from './utils/fs';

const savePage = (dir = process.cwd(), url) => {
  const { fileName, origin } = parseRootName(url);
  const { htmlName, dirName } = addRootExt(fileName);
  const htmlPath = fs.getPath(dir, htmlName);
  const dirPath = fs.getPath(dir, dirName);
  let allLinks, savedHtml, resoursePath;

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

  return axios
    .get(url)
    .then(({ data }) => {
      const { links, html } = replaceLinks(data, dirName, url);
      allLinks = links;
      savedHtml = html;
      return fs.writeFile(htmlPath, html);
    })
    .then(() => {
      const promiseLinks = allLinks.map(buildPromise);
      return Promise.all(promiseLinks);
    })
    .then(() => ({ path: resoursePath, html: savedHtml }));
};

export default savePage;
