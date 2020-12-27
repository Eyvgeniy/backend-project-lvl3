import fs from 'fs/promises';
import path from 'path';

export const getPath = (dir, filename) => path.join(dir, filename);
export const mkdir = (path) =>
  fs.mkdir(path, { recursive: true }).catch((err) => {
    throw new Error(err);
  });

export const writeFile = (path, data) => fs.writeFile(path, data);
