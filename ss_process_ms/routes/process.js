const express = require("express");
const router = express.Router();
const procesosController = require("../controllers/procesosController");

router.get("/", procesosController.getProcesos);
router.post("/", procesosController.createProceso);
router.put("/:id/estado", procesosController.updateEstado);

module.exports = router;