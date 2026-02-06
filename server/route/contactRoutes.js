const express = require('express');
const { Addcontact, GetContact, UpdateContact, DeleteContact } = require('../controller/contactController');
const router = express.Router();

router.post("/add", Addcontact);
router.get("/get", GetContact);
router.put("/update/:id", UpdateContact);
router.delete("/delete/:id", DeleteContact);

module.exports = router;
