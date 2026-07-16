import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import path from "path";
import fs from "fs";
import { HttpError } from "../error/http-error";

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "../../public/profile_pictures"
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);

    cb(null, `profile-${uniqueId}${extension}`);
  },
});


const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "../../public/book_covers"
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);

    cb(null, `book-${uniqueId}${extension}`);
  },
});


const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new HttpError(
        400,
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }
};

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter,
});

const bookUpload = multer({
  storage: bookStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export const uploads = {
  profile: {
    single: (fieldName: string) =>
      profileUpload.single(fieldName),

    array: (fieldName: string, maxCount: number) =>
      profileUpload.array(fieldName, maxCount),
  },

  book: {
    single: (fieldName: string) =>
      bookUpload.single(fieldName),

    array: (fieldName: string, maxCount: number) =>
      bookUpload.array(fieldName, maxCount),
  },
};