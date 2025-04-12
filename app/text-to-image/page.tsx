"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePromptInput } from "@/components/ImagePromptInput";
import { ImageResultDisplay } from "@/components/ImageResultDisplay";
import { ImageIcon, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryItem } from "@/lib/types";

export default function Text2Img() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
  
      const imageToEdit = generatedImage || image;
  
      const requestData = {
        prompt,
        image: imageToEdit,
        history: history.length > 0 ? history : undefined,
      };
  
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      console.log(description)
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image. Please try again.");
      }
  
      const data = await response.json();
  
      if (data.image) {
        setGeneratedImage(data.image);
        setDescription(data.description);
  
        const userMessage: HistoryItem = {
          role: "user",
          parts: [{ text: prompt }, ...(imageToEdit ? [{ image: imageToEdit }] : [])],
        };
  
        const aiResponse: HistoryItem = {
          role: "model",
          parts: [
            ...(data.description ? [{ text: data.description }] : []),
            ...(data.image ? [{ image: data.image }] : []),
          ],
        };
  
        setHistory((prevHistory) => [...prevHistory, userMessage, aiResponse]);
      } else {
        throw new Error("No image returned from API.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      console.error("Error processing request:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setDescription(null);
    setLoading(false);
    setError(null);
    setHistory([]);
  };

  // If we have a generated image, we want to edit it next time
  const currentImage = generatedImage || image;
  const isEditing = !!currentImage;

  // Get the latest image to display (always the generated image)
  const displayImage = generatedImage;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-4xl border-0 bg-card shadow-none">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wand2 className="w-8 h-8 text-primary" />
            Image Creation & Editing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 w-full">
        {error && (
  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex justify-between items-center">
    <span>{error}</span>
    <button
      onClick={() => handlePromptSubmit(description || "Generate an image")}
      className="ml-4 px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
    >
      Retry
    </button>
  </div>
)}


          {!displayImage && !loading ? (
            <>
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={currentImage}
              />
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isEditing={isEditing}
                isLoading={loading}
              />
            </>
          ) : loading ? (
            <div
              role="status"
              className="flex items-center mx-auto justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-secondary"
            >
              <ImageIcon className="w-10 h-10 text-gray-200 dark:text-muted-foreground" />
              <span className="pl-4 font-mono font-xs text-muted-foreground">
                Processing...
              </span>
            </div>
          ) : (
            <>
              <ImageResultDisplay
                imageUrl={displayImage || ""}
                description={description}
                onReset={handleReset}
                conversationHistory={history}
              />
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isEditing={true}
                isLoading={loading}
              />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}