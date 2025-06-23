const express = require("express");
const router = express.Router();
const processController = require("../controllers/processController");

router.get("/", processController.getProcesos);
router.post("/", processController.createProceso);
router.put("/:id/estado", processController.updateEstado);

module.exports = router;