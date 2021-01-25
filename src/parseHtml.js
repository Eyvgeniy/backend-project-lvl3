import cheerio from 'cheerio';
import prettier from 'prettier';
import path from 'path';
import { parseResourseName } from './utils/index.js';

const resoursesObj = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const beginOfHtmltExpected = "<!DOCTYPE html><html lang=\"ru\"><head>";
const beginOfHtmltTemplate = "<!DOCTYPE html>\n<html lang=\"ru\">\n    <head>";
const endOfHtmlExpected = "\n\n</body></html>";
const endOfHtmlTemplate = "    </body>\n</html>\n";

export default (data, dirName, url) => {
  const $ = cheerio.load(data, { decodeEntities: false });
  const originUrl = new URL(url);

  const normalize = (link) => {
    const normalizeLink = new URL(link, url);
    return { link, normalizeLink };
  };

  const allLinks = Object.entries(resoursesObj).flatMap(([tag, attr]) =>
    $(tag)
      .map((i, el) => $(el).attr(attr))
      .get(),
  );

  const filteredLinks = allLinks
    .map(normalize)
    .filter(({ normalizeLink }) => normalizeLink.origin === originUrl.origin);

  const hash = filteredLinks.map((link) => {
    const filePath = parseResourseName(link.normalizeLink);
    return { ...link, path: path.join(dirName, filePath) };
  });
  const links = filteredLinks.map(({ normalizeLink }) => normalizeLink.href);

  const html = hash
    .reduce((acc, el) => acc.replace(el.link, el.path.trim()), data)
    .split(' />')
    .join('>')
    .replace(beginOfHtmltTemplate, beginOfHtmltExpected)
    .replace(endOfHtmlTemplate, endOfHtmlExpected);

  return { links, html };
};
