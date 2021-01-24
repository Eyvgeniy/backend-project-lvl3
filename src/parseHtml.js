import cheerio from 'cheerio';
import path from 'path';
import { parseResourseName } from './utils/index.js';

const resoursesObj = {
  img: 'src',
  link: 'href',
  script: 'src',
};

export default (data, dirName, url) => {
  console.log(data);

  const $ = cheerio.load(data, { decodeEntities: false });
  const originUrl = new URL(url);

  const normalize = (link) => {
    const normalizeLink = new URL(link, url);
    return { link, normalizeLink };
  };

  const allLinks = Object.entries(resoursesObj).flatMap(([tag, attr]) => $(tag)
    .map((i, el) => $(el).attr(attr))
    .get());

  const filteredLinks = allLinks
    .map(normalize)
    .filter(({ normalizeLink }) => normalizeLink.origin === originUrl.origin);

  const hash = filteredLinks.map((link) => {
    const filePath = parseResourseName(link.normalizeLink);
    return { ...link, path: path.join(dirName, filePath) };
  });
  const links = filteredLinks
    .map(({ normalizeLink }) => normalizeLink.href)
    .filter((link) => link !== url);

  const html = hash.reduce((acc, el) => acc.replace(el.link, el.path), data);

  return { links, html };
};
