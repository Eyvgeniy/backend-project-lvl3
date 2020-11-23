import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import nock from 'nock';
import getFileNameFromUrl from '../src/utils';
import loadPage from '../src';

const URL = 'https://ru.hexlet.io/courses';
const templatePath = path.join(__dirname, '__fixtures__', 'template.html');
const filename = 'ru-hexlet-io-courses.html';
let tmpDir;
let templateData;

beforeAll(async () => {
  templateData = await fs.readFile(templatePath, 'utf-8');
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  nock('https://ru.hexlet.io/').get('/courses').reply(200, templateData);
});

test('check formated filename', () => {
  const result = formatUrl(URL);
  expect(result).toBe(filename);
});

test('load page', async () => {
  const result = await pageLoad(URL, tmpDir);
  const filePath = path.join(tmpDir, filename);
  const fileData = await fs.readFile(filePath, 'utf-8');
  expect(templateData).toBe(fileData);
  expect(result).toBe(filePath);
});
