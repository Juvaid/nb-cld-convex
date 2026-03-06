"use client";

import { useState, useCallback } from "react";

export interface UploadResult {
    url: string;
    mediaId: string;
    filename: string;
    type: string;
    size: number;
}

export interface FileUploadState {
    file: File;
    status: "pending" | "uploading" | "done" | "error";
    result?: UploadResult;
    error?: string;
}

/**
 * Sends one or more files to /api/media/upload in a single batched request.
 * The auth token is automatically included via the __session cookie (same-origin).
 */
export function useUpload() {
    const [uploads, setUploads] = useState<FileUploadState[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = useCallback(async (files: File[], folder?: string): Promise<UploadResult[]> => {
        if (files.length === 0) return [];

        // Mark all as pending then uploading
        const initial: FileUploadState[] = files.map((file) => ({ file, status: "pending" }));
        setUploads(initial);
        setIsUploading(true);

        // Set them all to uploading state
        setUploads((prev) => prev.map((u) => ({ ...u, status: "uploading" })));

        try {
            const formData = new FormData();
            for (const file of files) formData.append("file", file);
            if (folder) formData.append("folder", folder);

            // Token is stored in localStorage by the auth context
            const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

            const response = await fetch("/api/media/upload", {
                method: "POST",
                headers: token ? { "x-auth-token": token } : {},
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                const errMsg = data.error ?? "Upload failed";
                setUploads((prev) => prev.map((u) => ({ ...u, status: "error", error: errMsg })));
                throw new Error(errMsg);
            }

            const results: UploadResult[] = data.results;

            setUploads((prev) =>
                prev.map((u, i) => ({
                    ...u,
                    status: "done",
                    result: results[i],
                }))
            );

            return results;
        } catch (error) {
            console.error("[useUpload] batch upload error:", error);
            return [];
        } finally {
            setIsUploading(false);
        }
    }, []);

    /** Convenience: upload a single File with optional folder, returns the first result or false. */
    const uploadFile = useCallback(
        async (file: File, folder?: string): Promise<{ url: string; mediaId: string } | false> => {
            const results = await uploadFiles([file], folder);
            if (results.length === 0) return false;
            return { url: results[0].url, mediaId: results[0].mediaId };
        },
        [uploadFiles]
    );

    const clearUploads = useCallback(() => setUploads([]), []);

    return { uploadFile, uploadFiles, uploads, isUploading, clearUploads };
}
