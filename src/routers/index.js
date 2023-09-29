import { Router } from "express";

import { userRoute } from "./routeUser.js";
import { taskRoute } from "./routeTask.js";

const router = Router();

router.use("/user", userRoute);
router.use("/task", taskRoute);

export { router };
