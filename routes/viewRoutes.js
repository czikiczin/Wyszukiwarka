const express = require("express");
const viewController = require("../controllers/viewController.js");

const router = express.Router();

//router.get("/", viewController.getMainPage);
//router.get('/sc', scrapperController.scrapeData);
router.get("/", viewController.getAllProducts);
router.get("/:id", viewController.getProductById);

module.exports = router;
