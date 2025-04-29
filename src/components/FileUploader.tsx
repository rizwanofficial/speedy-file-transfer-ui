
import { DragEvent, RefObject } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
  fileInputRef,
  onFileChange
}: FileUploaderProps) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Drag and drop files here
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse your device
        </p>
        <Button 
          onClick={onBrowseClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Browse Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          multiple
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUploader;
