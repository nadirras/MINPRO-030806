import { Request } from 'express';
import multer from 'multer';
import path from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
  const defaultDir = path.join(__dirname, '../../public/');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      const destination = folderName ? path.join(defaultDir, folderName) : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = `${filePrefix}-${Date.now()}.${fileExtension}`;
      cb(null, newFileName);
    }
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  };

  return multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
  });
};
