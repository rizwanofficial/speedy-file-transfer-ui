
import { useState, useRef, DragEvent } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { FileWithProgress } from "@/types/file";

const Index = () => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
      id: `${file.name}-${Date.now()}`
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    newFiles.forEach(fileObj => {
      uploadFile(fileObj);
    });
  };
  
  const uploadFile = async (fileObj: FileWithProgress) => {
    const { file, id } = fileObj;
    
    // Simulate an upload process with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) progress = 100;
      
      // Update the state with the new progress
      setFiles(prev => 
        prev.map(f => 
          f.id === id 
            ? { ...f, progress } 
            : f
        )
      );
      
      if (progress === 100) {
        clearInterval(interval);
        
        // Simulate successful upload - in a real app this would be a server response
        setTimeout(() => {
          setFiles(prev => 
            prev.map(f => 
              f.id === id 
                ? { ...f, status: 'completed' } 
                : f
            )
          );
          
          toast.success(`${file.name} uploaded successfully with chmod 777 permissions`);
        }, 500);
      }
    }, 300);
  };
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-2">
          File Upload Tool
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Upload multiple files to /Volumes/VDS_TST/ExpressLane/VodAssetIngest/ with chmod 777 permissions
        </p>
        
        <FileUploader
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBrowseClick={handleBrowseClick}
          fileInputRef={fileInputRef}
          onFileChange={(e) => handleFileSelection(e.target.files)}
        />
        
        {files.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Files</h2>
            <FileList files={files} onRemove={removeFile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
