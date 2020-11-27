import cheerio from 'cheerio';
import path from 'path';
import { parseResourseName } from './utils';

const resourses = ['img'];

export default (html, dirName, origin) => {
  const links = [];

  const $ = cheerio.load(html, { decodeEntities: false });
  resourses.map((el) => {
    const elements = $('body').find(el);
    if (!elements.is('img')) return;
    elements.each((i, el) => {
      const link = $(el).attr('src');
      const fullLink = new URL(link, origin);
      links.push(fullLink.href);
      const filePath = parseResourseName(fullLink);
      const fullPath = path.join(dirName, filePath);
      $(el).attr('src', fullPath);
    });
  });
  if (links.length === 0) return { html, links };
  return { links, html: $.html() };
};
