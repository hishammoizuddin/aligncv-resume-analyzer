
import React, { useState, useRef } from 'react';
import { Upload, FileText, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileContent: (content: string) => void;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileContent, 
  accept = ".pdf,.docx" 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    setError(null);
    
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'pdf') {
        await handlePdfFile(file);
      } else if (fileType === 'docx') {
        await handleDocxFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been parsed and loaded`,
      });
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : 'Failed to parse file',
      });
    } finally {
      setIsUploading(false);
      // Reset the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handlePdfFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfParser = await import('pdf-parse/lib/pdf-parse.js');
      const pdfData = await pdfParser.default(Buffer.from(arrayBuffer));
      onFileContent(pdfData.text);
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error("Failed to parse PDF file. Please ensure the file is not corrupted or password-protected.");
    }
  };
  
  const handleDocxFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import('mammoth/mammoth.browser.js');
      const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
      });
      onFileContent(result.value);
    } catch (error) {
      console.error("DOCX parsing error:", error);
      throw new Error("Failed to parse DOCX file. Please ensure the file is not corrupted.");
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Update the file input value
      if (fileInputRef.current) {
        // Create a new DataTransfer object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(e.dataTransfer.files[0]);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger the onChange handler manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };
  
  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          ref={fileInputRef}
        />
        <label 
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 border-primary/20 hover:bg-muted/40 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-primary" />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PDF or DOCX files only</p>
          </div>
        </label>
      </div>
      
      {fileName && (
        <div className="text-sm flex items-center gap-2 p-2 bg-muted rounded">
          {fileName.endsWith('.pdf') ? (
            <FileText className="h-4 w-4 text-primary" />
          ) : (
            <File className="h-4 w-4 text-primary" />
          )}
          <span className="font-medium">{fileName}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {isUploading ? 'Parsing...' : 'Parsed'}
          </span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUploader;
