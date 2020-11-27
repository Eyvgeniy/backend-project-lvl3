import os from 'os';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import savePage from '../src';

const __dirname = dirname(fileURLToPath(import.meta.url));
const img = 'node.png';
const html = 'template.html';
const htmlImg = 'template_img.html';
const htmlImgSaved = 'template_img_saved.html';
const URL = 'https://ru.hexlet.io/courses';
const htmlSaved = 'ru-hexlet-io-courses.html';
const htmlDir = 'ru-hexlet-io-courses_files';
const imgSaved = 'ru-hexlet-io-assets-professions-nodejs.png';
let tmpDir;
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);
const getTmpPath = (filename) => path.join(tmpDir, filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));
const readTmpFile = (filename) => fs.readFileSync(getTmpPath(filename));

const imgData = readFile(img);
const htmlData = readFile(html);
const htmlImgData = readFile(htmlImg);
const htmlImgSavedData = readFile(htmlImgSaved);

// test('check formated filename', () => {
//   const result = getFileNameFromUrl(URL);
//   expect(result).toBe(expectedFilename);
// });

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'page-loader-'));
});

test('load page', async () => {
  nock('https://ru.hexlet.io/').get('/courses').reply(200, htmlData);
  const result = await savePage(URL, tmpDir);
  const htmlSavedData = readTmpFile(htmlSaved);
  expect(htmlSavedData).toStrictEqual(htmlData);
});

test('load page with img', async () => {
  nock('https://ru.hexlet.io/')
    .get('/courses')
    .reply(200, htmlImgData)
    .get('/assets/professions/nodejs.png')
    .reply(200, imgData, {
      'Content-Type': 'image/png',
    });
  const resultPath = await savePage(URL, tmpDir);
  const htmlSavedData = readTmpFile(htmlSaved);
  expect(htmlSavedData).toStrictEqual(htmlImgSavedData);
  const htmlDirPath = getTmpPath(htmlDir);
  fs.accessSync(htmlDirPath);
  const imgSavedPath = path.join(htmlDirPath, imgSaved);
  const imgSavedData = fs.readFileSync(imgSavedPath);
  expect(imgSavedData).toStrictEqual(imgData);
});
