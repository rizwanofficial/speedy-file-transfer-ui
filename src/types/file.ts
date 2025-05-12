
export interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  id: string;
  errorMessage?: string;
}

export interface UploadSettings {
  path: string;
  permissions: string;
  sourcePath: string;
  destinationPath: string;
}
