import fs from 'fs/promises';
import path from 'path';

export const getPath = (dir, filename) => path.join(dir, filename);
export const mkdir = (path) =>
  fs.mkdir(path).catch((err) => {
    throw new Error('Can`t make dir', err.message);
  });

export const writeFile = (path, data) =>
  fs.writeFile(path, data).catch((err) => {
    throw new Error('Can`t write file', err.message);
  });
