import { secureApi } from "../config/apiClient";

export interface UploadedAsset {
  assetId: string;
  url: string;
  publicId: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadImages(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadedAsset[]> {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await secureApi.post("/api/v1/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    const data = response.data;
    if (
      data?.success &&
      Array.isArray(data.assets) &&
      data.assets.every((asset: UploadedAsset) => Boolean(asset.assetId))
    ) {
      return data.assets;
    }

    throw new Error(data?.message || "Invalid upload response");
  } catch (error: any) {
    console.error("Upload failed:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message || "Image upload failed");
  }
}