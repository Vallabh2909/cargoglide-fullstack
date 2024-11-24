import { Router } from "express";
import { loginUser,logoutUser,createCustomer,refreshAccessToken} from "../controllers/user.controller.js";
// import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();


router.route("/create-customer").post(createCustomer);
router.route("/login").post(loginUser);

//Secure
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);



export default router;