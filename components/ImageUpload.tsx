"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Upload as UploadIcon, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
  onError?: (error: string) => void;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function ImageUpload({ onImageSelect, currentImage, onError }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentImage) {
      setSelectedFile(null);
    }
  }, [currentImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      onError?.("Only PNG and JPEG files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError?.("File size exceeds 10MB.");
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        onImageSelect(e.target.result as string);
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      onError?.("Error reading file. Please try again.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onImageSelect("");
  };

  return (
    <div className="w-full">
      {!currentImage ? (
        <label
        className={`flex flex-col items-center justify-center w-full min-h-[150px] p-6 rounded-lg bg-secondary border-2 border-dashed cursor-pointer
          ${isLoading ? "opacity-50 cursor-wait" : "hover:bg-secondary/50"}`}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadIcon className="w-10 h-10 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop your image here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </label>
      
      ) : (
        <div className="flex flex-col items-center p-4 rounded-lg bg-secondary">
          <div className="flex w-full items-center mb-4">
            <ImageIcon className="w-8 h-8 text-primary mr-3" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate text-foreground">
                {selectedFile?.name || "Current Image"}
              </p>
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemove} className="ml-2">
              <X className="w-4 h-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
          <div className="w-full overflow-hidden rounded-md">
            <img src={currentImage} alt="Selected" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
