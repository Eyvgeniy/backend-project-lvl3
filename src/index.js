import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { getFileNameFromUrl } from './utils/index.js';

const savePage = (url, dir = process.cwd()) => {
  const filename = getFileNameFromUrl(url);
  const filePath = path.join(dir, filename);
  return axios.get(url).then(({ data }) => {
    return fs.writeFile(filePath, data).then(() => filePath);
  });
};

export default savePage;
