import multer from "multer";

const storage = multer.memoryStorage(); // store in memory first
export const upload = multer({ storage });
