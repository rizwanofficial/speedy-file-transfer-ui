
import { useState, useRef, DragEvent } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { FileWithProgress, UploadSettings } from "@/types/file";

interface UploadSectionProps {
  className?: string;
}

const UploadSection = ({ className = "" }: UploadSectionProps) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSettings, setUploadSettings] = useState<UploadSettings>({
    path: "/Volumes/VDS_TST/ExpressLane/VodAssetIngest/",
    permissions: "777",
    sourcePath: "/mnt/source/files/",
    destinationPath: "/Volumes/VDS_TST/ExpressLane/VodAssetIngest/"
  });
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:3001/api/upload");
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
      uploadFile(fileObj, uploadSettings);
    });
  };
  
  const uploadFile = async (fileObj: FileWithProgress, settings: UploadSettings) => {
    const { file, id } = fileObj;
    
    // Update status to uploading
    setFiles(prev => 
      prev.map(f => 
        f.id === id 
          ? { ...f, status: 'uploading' } 
          : f
      )
    );
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Build URL with query parameters for path, sourcePath, destinationPath, and permissions
      const url = new URL(apiUrl);
      url.searchParams.append('path', settings.path);
      url.searchParams.append('permissions', settings.permissions);
      url.searchParams.append('sourcePath', settings.sourcePath);
      url.searchParams.append('destinationPath', settings.destinationPath);
      
      // Track upload progress with XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          
          // Update the state with the new progress
          setFiles(prev => 
            prev.map(f => 
              f.id === id 
                ? { ...f, progress } 
                : f
            )
          );
        }
      });
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error occurred'));
        };
      });
      
      // Open and send the request
      xhr.open("POST", url.toString());
      xhr.send(formData);
      
      // Wait for the upload to complete
      await uploadPromise;
      
      // Update state to completed
      setFiles(prev => 
        prev.map(f => 
          f.id === id 
            ? { ...f, status: 'completed', progress: 100 } 
            : f
        )
      );
      
      toast.success(`${file.name} uploaded from ${settings.sourcePath} to ${settings.destinationPath} with chmod ${settings.permissions} permissions`);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setFiles(prev => 
        prev.map(f => 
          f.id === id 
            ? { ...f, status: 'error', errorMessage: errorMsg, progress: 100 } 
            : f
        )
      );
      toast.error(`Failed to upload ${file.name}: ${errorMsg}`);
    }
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
  
  const handleSettingsChange = (key: keyof UploadSettings | 'apiUrl', value: string) => {
    if (key === 'apiUrl') {
      setApiUrl(value);
    } else {
      setUploadSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">File Upload Tool</h2>
      
      <Card className="p-6 mb-6 bg-white shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Path Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourcePath">Source Path</Label>
              <Input
                id="sourcePath"
                value={uploadSettings.sourcePath}
                onChange={(e) => handleSettingsChange('sourcePath', e.target.value)}
                placeholder="Enter source path"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationPath">Destination Path</Label>
              <Input
                id="destinationPath"
                value={uploadSettings.destinationPath}
                onChange={(e) => handleSettingsChange('destinationPath', e.target.value)}
                placeholder="Enter destination path"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">File Permissions</Label>
              <Input
                id="permissions"
                value={uploadSettings.permissions}
                onChange={(e) => handleSettingsChange('permissions', e.target.value)}
                placeholder="File permissions (e.g. 777)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                value={apiUrl}
                onChange={(e) => handleSettingsChange('apiUrl', e.target.value)}
                placeholder="http://localhost:3001/api/upload"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-center mb-4">
            Upload files from <span className="font-mono bg-gray-100 px-1 rounded">{uploadSettings.sourcePath}</span> to <span className="font-mono bg-gray-100 px-1 rounded">{uploadSettings.destinationPath}</span> with chmod {uploadSettings.permissions} permissions
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
        </div>
        
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Files</h3>
            <FileList files={files} onRemove={removeFile} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadSection;
