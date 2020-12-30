import os from 'os';
import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import savePage from '../src';

const __dirname = dirname(fileURLToPath(import.meta.url));
const link = 'https://ru.hexlet.io/';
const resorsesPaths = ['/assets/application.css', '/assets/nodejs.png', '/assets/runtime.js'];
const getFixturesFilesPath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const htmlTemplateName = 'template.html';
const htmlTemplateSavedName = 'template_saved.html';
let tmpDir, templateData, templateSavedData;
nock.disableNetConnect();
const scope = nock(link);

beforeAll(async () => {
  templateData = await fs.readFile(getFixturesFilesPath(htmlTemplateName), 'utf-8');
  templateSavedData = await fs.readFile(getFixturesFilesPath(htmlTemplateSavedName), 'utf-8');
});

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  scope.get('/courses').reply(200, templateData);
});

test('load page with resourses', async () => {
  resorsesPaths.forEach(async (path) => {
    const resourseData = await fs.readFile(getFixturesFilesPath(path));
    scope.get(path).reply(200, resourseData);
  });

  const { html } = await savePage(tmpDir, `${link}courses`);
  expect(html).toBe(templateSavedData);
});