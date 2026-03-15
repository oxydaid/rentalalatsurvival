import fs from 'node:fs/promises';
import path from 'node:path';

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${timestamp}-${originalName}`;
  
  // Ensure directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Save file
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

export async function deleteFile(fileUrl: string) {
  if (!fileUrl.startsWith('/uploads/')) return; // Don't delete external images
  
  const filename = fileUrl.replace('/uploads/', '');
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
  
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
