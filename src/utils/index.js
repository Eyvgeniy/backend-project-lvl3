import path from 'path';

const extentions = { html: '.html', dir: '_files' };
const regexp = /[^a-zA-Z0-9]/g;

const replaceSymbols = (str) => str.replace(regexp, '-');

export const addExt = (name, ext) => {
  if (!ext) {
    return [name, '.html'].join('');
  }

  return [name, ext].join('');
};

export const parseRootName = (url) => {
  const { host, pathname, origin } = new URL(url);
  const { dir, name, ext } = path.parse(pathname);
  let originPath = path.join(host, dir, name);
  if (originPath[originPath.length - 1] === '/') {
    originPath = originPath.slice(0, -1);
  }
  const fileName = replaceSymbols(originPath);
  return { fileName, ext, origin };
};

export const parseResourseName = (url) => {
  const { fileName, ext } = parseRootName(url);
  const filePath = addExt(fileName, ext);
  return filePath;
};

export const addRootExt = (pathToDir) => {
  const htmlName = addExt(pathToDir, extentions.html);
  const dirName = addExt(pathToDir, extentions.dir);
  return { htmlName, dirName };
};
