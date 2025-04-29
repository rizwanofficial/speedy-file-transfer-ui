
import { File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileWithProgress } from "@/types/file";

interface FileListProps {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
}

const FileList = ({ files, onRemove }: FileListProps) => {
  return (
    <ul className="space-y-3">
      {files.map((fileObj) => {
        const { file, progress, status, id } = fileObj;
        
        return (
          <li 
            key={id} 
            className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
          >
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <File className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-grow mr-3">
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              
              <Progress 
                value={progress} 
                className={`h-2 ${
                  status === 'completed' 
                    ? 'bg-green-100' 
                    : status === 'error' 
                      ? 'bg-red-100' 
                      : 'bg-blue-100'
                }`}
              />
              
              <div className="flex justify-between mt-1">
                <div className="flex items-center">
                  {status === 'completed' ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">Completed</span>
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-600 mr-1" />
                      <span className="text-xs text-red-600">Error</span>
                    </>
                  ) : (
                    <span className="text-xs text-blue-600">
                      {progress < 100 ? 'Uploading...' : 'Processing...'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
              </div>
            </div>
            
            <button
              onClick={() => onRemove(id)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Remove file"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;
