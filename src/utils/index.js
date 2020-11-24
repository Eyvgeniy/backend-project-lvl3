const ext = 'html';
const regexp = /[^a-zA-Z0-9]/g;

export const getFileNameFromUrl = (url) => {
  const pathWithoutProtocol = url.split('//')[1];
  const fileName = pathWithoutProtocol.replace(regexp, '-');
  const file = [fileName, ext].join('.');
  return file;
};
