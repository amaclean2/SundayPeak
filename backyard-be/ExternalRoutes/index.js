const { Router } = require("express");
const userRouter = require("./User");

const router = Router();

router.use('/user', userRouter);

module.exports = router;