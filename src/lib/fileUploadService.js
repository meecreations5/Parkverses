import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function validateVendorFiles(files) {
  const fileList = Array.from(files || []);

  if (fileList.length > 6) {
    return "You can upload maximum 6 files.";
  }

  const invalidFile = fileList.find(
    (file) => !ALLOWED_FILE_TYPES.includes(file.type)
  );

  if (invalidFile) {
    return "Only JPG, PNG, WEBP, and PDF files are allowed.";
  }

  const largeFile = fileList.find((file) => file.size > MAX_FILE_SIZE);

  if (largeFile) {
    return "Each file must be less than 5 MB.";
  }

  return "";
}

export async function uploadVendorFiles(files, folderId) {
  const fileList = Array.from(files || []);

  const uploadedFiles = await Promise.all(
    fileList.map(async (file, index) => {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `vendor_onboarding/${folderId}/${Date.now()}_${index}_${safeFileName}`;

      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file, {
        contentType: file.type,
      });

      const downloadUrl = await getDownloadURL(fileRef);

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        storagePath,
        downloadUrl,
        uploadedAt: new Date().toISOString(),
      };
    })
  );

  return uploadedFiles;
}