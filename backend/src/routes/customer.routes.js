import {Router} from "express";
import { createOrder,handleDocUpload,getUserDocuments } from "../controllers/customer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route to handle form submission
router.post("/create-order", createOrder);
router.get("/get-docs", verifyJWT,getUserDocuments);
router.post("/upload-doc",verifyJWT,upload.single("doc"),handleDocUpload)
// router.post("/upload-doc",verifyJWT,upload.single("doc"),(req,res)=>{
//     console.log(req.file);
//     console.log(req.user);
//     return res.status(200).json({message:"File uploaded successfully"})
// })
// router.post("/upload-doc",upload.single("doc"),(req,res)=>{
//     console.log(req.file);
//     return res.status(200).json({message:"File uploaded successfully"})
// })
export default router;
