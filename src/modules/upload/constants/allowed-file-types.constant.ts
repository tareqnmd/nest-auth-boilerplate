export const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
] as const;

export const ALLOWED_VIDEO_MIMETYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/webm',
  'video/3gpp',
  'video/x-flv',
] as const;

export const ALLOWED_DOCUMENT_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
] as const;

export const ALLOWED_AUDIO_MIMETYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
  'audio/flac',
] as const;

export const ALLOWED_ALL_MIMETYPES = [
  ...ALLOWED_IMAGE_MIMETYPES,
  ...ALLOWED_VIDEO_MIMETYPES,
  ...ALLOWED_DOCUMENT_MIMETYPES,
  ...ALLOWED_AUDIO_MIMETYPES,
] as const;

export type AllowedImageMimetype = (typeof ALLOWED_IMAGE_MIMETYPES)[number];
export type AllowedVideoMimetype = (typeof ALLOWED_VIDEO_MIMETYPES)[number];
export type AllowedDocumentMimetype =
  (typeof ALLOWED_DOCUMENT_MIMETYPES)[number];
export type AllowedAudioMimetype = (typeof ALLOWED_AUDIO_MIMETYPES)[number];
export type AllowedMimetype = (typeof ALLOWED_ALL_MIMETYPES)[number];
