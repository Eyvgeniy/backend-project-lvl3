import os from 'os';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import nock from 'nock';
import savePage from '../src';

const __dirname = dirname(fileURLToPath(import.meta.url));

const URL = 'https://ru.hexlet.io/courses';
const imgURL = 'https://ru.hexlet.io/assets/professions/nodejs.png';
const templatePath = path.join(__dirname, '__fixtures__', 'template.html');
const templateImgPath = path.join(__dirname, '__fixtures__', 'template_img.html');
const expectedHtmlImg = path.join(__dirname, '__fixtures__', 'template_img_saved.html');
const expectedFilename = 'ru-hexlet-io-courses.html';
const expectedDirName = 'ru-hexlet-io-courses_files';
const expectedImgName = 'ru-hexlet-io-assets-professions-nodejs.png';
const templateData = await fs.readFile(templatePath, 'utf-8');
const templateImgData = await fs.readFile(templateImgPath);
const expectedHtmlImgData = await fs.readFile(expectedHtmlImg, 'utf-8');
let tmpDir;

// test('check formated filename', () => {
//   const result = getFileNameFromUrl(URL);
//   expect(result).toBe(expectedFilename);
// });

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

// test('load page', async () => {
//   nock('https://ru.hexlet.io/').get('/courses').reply(200, templateData);
//   const filePath = path.join(tmpDir, expectedFilename);
//   const result = await savePage(URL, tmpDir);
//   const fileData = await fs.readFile(filePath, 'utf-8');
//   expect(templateData).toBe(fileData);
//   expect(result).toBe(filePath);
// });

test('load page with img', async () => {
  nock('https://ru.hexlet.io/')
    .get('/courses')
    .reply(200, templateImgData)
    .get('/assets/professions/nodejs.png')
    .replyWithFile(200, __dirname + '/__fixtures__/node.png', {
      'Content-Type': 'image/png',
    });
  await savePage(URL, tmpDir);
  const resultHtmlPath = path.join(tmpDir, expectedFilename);
  const resultDirPath = path.join(tmpDir, expectedDirName);
  const resultImgPath = path.join(resultDirPath, expectedImgName);
  await fs.access(resultDirPath);
  const temlateHtml = await fs.readFile(templateImgPath, 'utf-8');
  const templateImg = await fs.readFile(path.join(__dirname, '__fixtures__', 'node.png'));
  const resultHtml = await fs.readFile(resultHtmlPath, 'utf-8');
  const resultImg = await fs.readFile(resultImgPath).catch((err) => {
    throw new Error(err);
  });

  expect(resultHtml).toEqual(expectedHtmlImgData);
  expect(resultImg).toEqual(templateImg);
});

// afterEach(() => {
//   fs.rmdir(tmpDir);
// });
