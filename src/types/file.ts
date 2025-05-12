
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

export interface Job {
  name: string;
  url: string;
  successUrl: string;
}

export interface JobBuild {
  number?: number;
  status?: string;
  timestamp?: number;
  result?: string;
  url?: string;
}

export interface JobData {
  [key: string]: {
    lastBuild: JobBuild;
    lastSuccessfulBuild: JobBuild | null;
  };
}
