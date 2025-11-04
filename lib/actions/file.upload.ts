'use client';

import { Client, ID,Storage } from "node-appwrite";
import { appwriteConfig } from "../appwriter/config";

/**
 * Upload file ke Appwrite Storage.
 * - Untuk file > 5MB: pakai progress asli Appwrite SDK
 * - Untuk file <= 5MB: tambahkan animasi progress halus
 */
export const uploadFileWithProgress = async ({
  file,
  onProgress,
}: {
  file: File;
  onProgress?: (percent: number) => void;
}) => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setSession('current');

  const storage = new Storage(client);

  // Kalau file kecil, tampilkan animasi progres buatan biar UX halus
  if (file.size <= 5 * 1024 * 1024) {
    let simulatedProgress = 0;
    const timer = setInterval(() => {
      simulatedProgress += 10;
      onProgress?.(Math.min(simulatedProgress, 95));
    }, 150);

    try {
      const uploaded = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        file
      );
      clearInterval(timer);
      onProgress?.(100);
      return uploaded;
    } catch (err) {
      clearInterval(timer);
      throw err;
    }
  }

  // Untuk file >5MB, pakai progress asli SDK Appwrite
  const uploaded = await storage.createFile(
    appwriteConfig.bucketId,
    ID.unique(),
    file,
    [],
    (progress) => {
      if (onProgress && progress && typeof progress.progress === 'number') {
        onProgress(Math.round(progress.progress));
      }
    }
  );

  return uploaded;
};
