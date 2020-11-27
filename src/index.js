import axios from 'axios';
import { parseRootName, addRootExt, parseResourseName } from './utils/index.js';
import replaceLinks from './parseHtml';
import * as fs from './utils/fs';

const savePage = (url, dir = process.cwd()) => {
  const { fileName, origin } = parseRootName(url);
  const { htmlName, dirName } = addRootExt(fileName);
  const htmlPath = fs.getPath(dir, htmlName);
  const dirPath = fs.getPath(dir, dirName);
  return axios
    .get(url)
    .then(({ data }) => {
      const { links, html } = replaceLinks(data, dirName, origin);
      if (links.length === 0) {
        return fs.writeFile(htmlPath, html).then(() => htmlPath);
      } else {
        fs.writeFile(htmlPath, html);
        fs.mkdir(dirPath);
        const promiseLinks = links.map((link) => {
          return axios.get(link, { responseType: 'arraybuffer' }).then((response) => {
            const resourseName = parseResourseName(link);
            const resoursePath = fs.getPath(dirPath, resourseName);
            return fs.writeFile(resoursePath, response.data);
          });
        });
        return Promise.all(promiseLinks)
          .then(() => htmlPath)
          .catch((e) => {
            throw new Error(e);
          });
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export default savePage;
