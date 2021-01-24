import fs from 'fs/promises';
import path from 'path';

export const getPath = (dir, filename) => path.join(dir, filename);
export const mkdir = (dirPath) => fs.mkdir(dirPath, { recursive: true }).catch((err) => {
  throw new Error(err);
});

export const writeFile = (dirPath, data) => fs.writeFile(dirPath, data);

export const access = (dirPath) => fs.access(dirPath);
