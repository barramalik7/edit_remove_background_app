export interface ImageData {
  base64: string; // The pure base64 string (no data URI prefix)
  mimeType: string;
  dataUrl: string; // The full data URI for display
}

export interface GenerationResult {
  imageUrl: string | null;
  textResponse: string | null;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY_TO_EDIT = 'READY_TO_EDIT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
