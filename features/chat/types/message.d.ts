// Adapted from https://matrix.org/docs/spec/client_server/latest#m-room-message-msgtypes
enum MessageTypeEnum {
  audio = 'm.audio',
  emote = 'm.emote',
  file = 'm.file',
  image = 'm.image',
  location = 'm.location',
  notice = 'm.notice',
  text = 'm.text',
  video = 'm.video',
}

type MessageContent =
  | TextMessage
  | EmoteMessage
  | NoticeMessage
  | ImageMessage
  | FileMessage
  | AudioMessage
  | LocationMesssage
  | VideoMesssage


export interface BaseMessage {
  body: string;
  msgtype: MessageTypeEnum;
}

/**
 * Most basic message and is used to represent text.
 * @example
 * "body": "This is an example text message",
 * "format": "org.matrix.custom.html",
 * "formattedBody": "<b>This is an example text message</b>",
 * "msgtype": "m.text"
 */
export interface TextMessage extends BaseMessage {
  msgtype: MessageTypeEnum.text;
  /** The format used in the formattedBody. Currently only org.matrix.custom.html is supported. */
  format: string;
  /** The formatted version of the body. This is required if format is specified. */
  formattedBody: string;
}

/**
 * This message is similar to m.text except that the sender is 'performing' the action contained in the body key, similar to /me in IRC. 
 * This message should be prefixed by the name of the sender. This message could also be represented in a different colour to distinguish it from regular m.text messages.
 * @example
 * "body": "thinks this is an example emote",
 * "format": "org.matrix.custom.html",
 * "formattedBody": "thinks <b>this</b> is an example emote",
 * "msgtype": "m.emote"
 */
export interface EmoteMessage extends BaseMessage {
  msgtype: MessageTypeEnum.emote;
  /** The format used in the formattedBody. Currently only org.matrix.custom.html is supported. */
  format?: string;
  /** The formatted version of the body. This is required if format is specified. */
  formattedBody?: string;
}

/**
 * The m.notice type is primarily intended for responses from automated clients.
 * An m.notice message must be treated the same way as a regular m.text message with two exceptions.
 * Firstly, clients should present m.notice messages to users in a distinct manner, 
 * and secondly, m.notice messages must never be automatically responded to.
 * This helps to prevent infinite-loop situations where two automated clients continuously exchange messages.
 * @example
 * "body": "This is an example notice",
 * "format": "org.matrix.custom.html",
 * "formattedBody": "This is an <strong>example</strong> notice",
 * "msgtype": "m.notice"
 */
export interface NoticeMessage extends BaseMessage {
  msgtype: MessageTypeEnum.notice;
  /** The format used in the formattedBody. Currently only org.matrix.custom.html is supported. */
  format?: string;
  /** The formatted version of the body. This is required if format is specified. */
  formattedBody?: string;
}

/**
 * This message represents a single image and an optional thumbnail.
 * @example
 * "body": "filename.jpg",
 * "info": {
 *   "h": 398,
 *   "mimetype": "image/jpeg",
 *   "size": 31037,
 *   "w": 394
 * },
 * "msgtype": "m.image",
 * "url": "mxc://example.org/JWEIFJgwEIhweiWJE"
 */
export interface ImageMessage extends BaseMessage {
  msgtype: MessageTypeEnum.image;
  /**
   * A textual representation of the image. 
   * This could be the alt text of the image, the filename of the image, 
   * or some kind of content description for accessibility e.g. 'image attachment'.
   */
  body: string;

  /**
   * Metadata about the image referred to in url.
   */
  info?: ImageInfo;

  /**
   * The URL (typically MXC URI) to the image.
   * Required if the file is unencrypted. 
   */
  url?: string;

  /**
   * Information on the encrypted file, as specified in End-to-end encryption.
   * Required if the file is encrypted.
   */
  file?: EncryptedFile;
}

/**
 * This message represents a generic file.
 * @example
 * "body": "something-important.doc",
 * "filename": "something-important.doc",
 * "info": {
 *   "mimetype": "application/msword",
 *   "size": 46144
 * },
 * "msgtype": "m.file",
 * "url": "mxc://example.org/FHyPlCeYUSFFxlgbQYZmoEoe"
 */
export interface FileMessage extends BaseMessage {
  msgtype: MessageTypeEnum.file;
  /** A human-readable description of the file. This is recommended to be the filename of the original upload. */
  body: string;
  /** 
   * Required if the file is unencrypted.
   * The URL (typically MXC URI) to the file.
   */
  url?: string;
  /** 
   * Required if the file is encrypted. 
   * Information on the encrypted file, as specified in End-to-end encryption. 
   */
  file?: EncryptedFile;
  /** The original filename of the uploaded file. */
  filename?: string;
  /** Information about the file referred to in url. */
  info?: FileInfo;
}

/**
 * This message represents a single audio clip.
 * @example
 * "body": "Bee Gees - Stayin' Alive",
 * "info": {
 *   "duration": 2140786,
 *   "mimetype": "audio/mpeg",
 *   "size": 1563685
 * },
 * "msgtype": "m.audio",
 * "url": "mxc://example.org/ffed755USFFxlgbQYZGtryd"
 */
export interface AudioMessage extends BaseMessage {
  msgtype: MessageTypeEnum.audio,
  /**
   * A description of the audio e.g. 'Bee Gees - Stayin' Alive', 
   * or some kind of content description for accessibility e.g. 'audio attachment'.
   */
  body: string;

  /** Metadata for the audio clip referred to in url. */
  info?: AudioInfo;

  /**
   * The URL (typically MXC URI) to the image.
   * Required if the file is unencrypted. 
   */
  url?: string;

  /**
   * Information on the encrypted file, as specified in End-to-end encryption.
   * Required if the file is encrypted.
   */
  file?: EncryptedFile;
}

/**
 * This message represents a real-world location.
 * @example
 * "body": "Big Ben, London, UK",
 * "geo_uri": "geo:51.5008,0.1247",
 * "info": {
 *   "thumbnail_info": {
 *     "h": 300,
 *     "mimetype": "image/jpeg",
 *     "size": 46144,
 *     "w": 300
 *   },
 *   "thumbnail_url": "mxc://example.org/FHyPlCeYUSFFxlgbQYZmoEoe"
 * },
 * "msgtype": "m.location"
 */
export interface LocationMesssage extends BaseMessage {
  msgtype: MessageTypeEnum.location;

  /** A description of the location e.g. 'Big Ben, London, UK', 
   * or some kind of content description for accessibility e.g. 'location attachment'.
   */
  body: string

  /** A geo URI representing this location. **/
  geo_uri: string;

  info?: LocationInfo;
}

/**
 * This message represents a single video clip.
 * @example
 * "body": "Gangnam Style",
 * "info": {
 *   "duration": 2140786,
 *   "h": 320,
 *   "mimetype": "video/mp4",
 *   "size": 1563685,
 *   "thumbnail_info": {
 *      "h": 300,
 *      "mimetype": "image/jpeg",
 *      "size": 46144,
 *      "w": 300
 *   },
 *   "thumbnail_url": "mxc://example.org/FHyPlCeYUSFFxlgbQYZmoEoe",
 *   "w": 480
 * },
 * "msgtype": "m.video",
 * "url": "mxc://example.org/a526eYUSFFxlgbQYZmo442"
 */
export interface VideoMesssage extends BaseMessage {
  msgtype: MessageTypeEnum.video;

  /** 
   * A description of the video e.g. 'Gangnam style', 
   * or some kind of content description for accessibility e.g. 'video attachment'.
   */
  body: string

  info?: VideoInfo;

  /** Required if the file is unencrypted. The URL (typically MXC URI) to the video clip. */
  url?: string

  /** Required if the file is encrypted. Information on the encrypted file, as specified in End-to-end encryption. */
  file?: EncryptedFile;
}


// ----------------------------- //
//        ADDITIONAL TYPES       //
// ----------------------------- //
interface ImageInfo {
  /**
   * The intended display height of the image in pixels. 
   * This may differ from the intrinsic dimensions of the image file.
   */
  h: number;

  /**
   * The intended display width of the image in pixels.
   * This may differ from the intrinsic dimensions of the image file.
   */
  w: number;

  /** The mimetype of the image, e.g. image/jpeg. */
  mimetype: string;

  /** Size of the image in bytes. */
  size: number;

  /**
   * The URL (typically MXC URI) to a thumbnail of the image.
   * Only present if the thumbnail is unencrypted.
   */
  thumbnail_url: string

  /**
   * Information on the encrypted thumbnail file, 
   * as specified in End-to-end encryption. 
   * Only present if the thumbnail is encrypted.
   */
  thumbnail_file: EncryptedFile;

  /** Metadata about the image referred to in thumbnail_url. */
  thumbnail_info: ThumbnailInfo;
}

interface FileInfo {
  /** The mimetype of the file e.g. application/msword. */
  mimetype: string;
  /** The size of the file in bytes. */
  size: integer;
  /** The URL to the thumbnail of the file. Only present if the thumbnail is unencrypted. */
  thumbnail_url: string;
  /** Information on the encrypted thumbnail file, as specified in End-to-end encryption. Only present if the thumbnail is encrypted. */
  thumbnail_file: EncryptedFile;
  /** Metadata about the image referred to in thumbnail_url. */
  thumbnail_info: ThumbnailInfo;
}


interface ThumbnailInfo {
  /**
   * The intended display height of the image in pixels.
   * This may differ from the intrinsic dimensions of the image file.
   */
  h: number;

  /**
   * The intended display width of the image in pixels. 
   * This may differ from the intrinsic dimensions of the image file.
   */
  w: integer;

  /** The mimetype of the image, e.g. image/jpeg. */
  mimetype: string;

  /** Size of the image in bytes. */
  size: integer;
}

interface LocationInfo {
  /** Information on the encrypted thumbnail file, 
   * as specified in End-to-end encryption. 
   * Only present if the thumbnail is encrypted.
   */
  thumbnail_file?: EncryptedFile;

  /** 
   * The URL to the thumbnail of the file.
   * Only present if the thumbnail is unencrypted.
   */
  thumbnail_url?: string;

  /** Metadata about the image referred to in thumbnail_url. **/
  thumbnail_info?: ThumbnailInfo
}

interface VideoInfo {
  /** The duration of the video in milliseconds. */
  duration: number;
  /** The height of the video in pixels. */
  h: number;
  /** The width of the video in pixels. */
  w: number;
  /** The mimetype of the video e.g. video/mp4. */
  mimetype: string
  /** The size of the video in bytes. */
  size: number;
  /** The URL (typically MXC URI) to an image thumbnail of the video clip. Only present if the thumbnail is unencrypted. */
  thumbnail_url: string
  /** Information on the encrypted thumbnail file, as specified in End-to-end encryption. Only present if the thumbnail is encrypted. */
  thumbnail_file: EncryptedFile
  /** Metadata about the image referred to in thumbnail_url. */
  thumbnail_info: ThumbnailInfo
}

/**
 * This module adds file and thumbnail_file properties,
 * of type EncryptedFile, to m.message msgtypes that reference files, 
 * such as m.file and m.image, replacing the url and thumbnail_url properties.
 */
interface EncryptedFile {
  /** The URL to the file. */
  url: string;

  /** Required. A JSON Web Key object. */
  key: JWK;

  /** The 128-bit unique counter block used by AES-CTR, encoded as unpadded base64. */
  iv: string;

  /** 
   * A map from an algorithm name to a hash of the ciphertext, encoded as unpadded base64.
   * Clients should support the SHA-256 hash, which uses the key sha256.
   */
  hashes: Record<string, string>

  /** Version of the encrypted attachments protocol. Must be v2. */
  v: string;
}

interface JWK {
  /** Key type. Must be oct. */
  kty: string;
  /** Key operations. Must at least contain encrypt and decrypt. */
  key_ops: string[];
  /** Algorithm. Must be A256CTR. */
  alg: string;
  /** The key, encoded as urlsafe unpadded base64. */
  k: string;
  /** Extractable. Must be true. This is a W3C extension. */
  ext: boolean;
}



