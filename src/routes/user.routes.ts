import { Router } from 'express';
import { userSignUp, userSignIn } from '../controllers/auth.controller.js';



const router = Router();

// Auth routes
router.route("/user/signup")
    .post(userSignUp);

router.route("/user/login")
    .post(userSignIn);

export default router;