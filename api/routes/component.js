const express = require('express');
const router = express.Router();
const authenticate = require('../auth/check-auth');


const Component = require('../models/component');

const ComponentController = require('../controllers/component');

// handle get for all components.
router.get("/", ComponentController.component_get_all)
// handle get for single component by id.
router.get("/:componentID", ComponentController.component_get_one);

//router.post('/', authenticate, ComponentController.component_post);
router.post('/', ComponentController.component_post);

router.patch("/:componentID", ComponentController.component_patch)

router.delete("/:componentID", ComponentController.component_delete)

module.exports = router;