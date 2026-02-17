"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export function useUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const generateUploadUrl = useMutation(api.media.generateUploadUrl);
    const saveMedia = useMutation(api.media.saveMedia);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        try {
            // 1. Generate upload URL
            const postUrl = await generateUploadUrl();

            // 2. Post file to Convex storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Save media metadata to DB
            await saveMedia({
                filename: file.name,
                storageId,
                type: file.type,
            });

            return true;
        } catch (error) {
            console.error("Upload error:", error);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
}
