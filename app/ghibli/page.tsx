"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageResultDisplay } from "@/components/ImageResultDisplay";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GhibliImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]); // Store multiple images

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const predefinedPrompt = `
  Take the given image and enhance it into a Studio Ghibli-style artwork while preserving its original details. 
  - Apply a hand-painted look with soft brushstrokes and pastel colors.
  - Keep the key objects and subject in the same position.
  - Use warm lighting, gentle contrast, and detailed backgrounds.
  - Do NOT generate a completely new scene. The image structure must remain the same.
  - Ensure smooth textures and avoid rough or noisy results.
  - Enhance facial expressions in a Ghibli style without distorting the features.
  - Maintain high resolution and avoid pixelation.
`;


  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
  };

 
const handleImageConversion = async () => {
  if (!image) return;

  try {
    setLoading(true);
    setError(null);

    const requestData = {
      prompt: predefinedPrompt,
      image: image, // Base64 image data
    };

    const response = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image.");
    }

    const data = await response.json();
    if (data.images) {
      setGeneratedImages(data.images.map((img) => img.image)); // Store all three images
    } else {
      throw new Error("No images returned from API.");
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    console.error("Error processing request:", error);
  } finally {
    setLoading(false);
  }
};

return (
  <main className="min-h-screen flex items-center justify-center bg-background p-8">
    <Card className="w-full max-w-3xl border-0 bg-card shadow-lg p-6">
      <CardHeader className="flex flex-col items-center justify-center space-y-2">
        <CardTitle className="text-center text-xl font-bold text-foreground">
          Convert Your Image to Ghibli-Style Art
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 w-full text-center">
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        {!generatedImages.length && !loading ? (
          <>
            <ImageUpload onImageSelect={handleImageSelect} currentImage={image} />
            <button
              onClick={handleImageConversion}
              disabled={!image}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 disabled:opacity-50"
            >
              Convert to Ghibli Art
            </button>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse">
            <ImageIcon className="w-10 h-10 text-gray-200" />
            <span className="pl-4 text-muted-foreground">Processing...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedImages.map((img, index) => (
                <ImageResultDisplay key={index} imageUrl={img} description={`Variation ${index + 1}`} />
              ))}
            </div>
            <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg mt-4">
              Reset
            </button>
          </>
        )}
      </CardContent>
    </Card>
  </main>
);
