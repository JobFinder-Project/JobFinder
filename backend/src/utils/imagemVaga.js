import path from 'node:path';

const allowedImageExtensionsByMimeType = {
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg', '.jpeg'],
};

export const isAllowedVagaImageMetadata = (file) => {
  const allowedExtensions = allowedImageExtensionsByMimeType[file.mimetype];
  const fileExtension = path.extname(file.originalname || '').toLowerCase();

  return Boolean(allowedExtensions?.includes(fileExtension));
};

const hasPngSignature = (buffer) =>
  buffer.length >= 8 &&
  buffer[0] === 0x89 &&
  buffer[1] === 0x50 &&
  buffer[2] === 0x4e &&
  buffer[3] === 0x47 &&
  buffer[4] === 0x0d &&
  buffer[5] === 0x0a &&
  buffer[6] === 0x1a &&
  buffer[7] === 0x0a;

const hasJpegSignature = (buffer) =>
  buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

const hasSvgSignature = (buffer) => {
  const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024)).trimStart();

  return content.startsWith('<svg') || (content.startsWith('<?xml') && content.includes('<svg'));
};

export const isAllowedVagaImageContent = (file) => {
  if (!file.buffer) return false;

  if (file.mimetype === 'image/png') return hasPngSignature(file.buffer);
  if (['image/jpeg', 'image/jpg'].includes(file.mimetype)) return hasJpegSignature(file.buffer);
  if (file.mimetype === 'image/svg+xml') return hasSvgSignature(file.buffer);

  return false;
};
