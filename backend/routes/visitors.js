const express = require('express');
const {getVisitors,getVisitor,createVisitor,deleteVisitor,updateVisitor,} = require('../controllers/visitorController')
const { requireAuth } = require('../middleware/auth');
const { uploadSinglePhoto } = require('../middleware/upload');

const router = express.Router();

router.use(requireAuth);

router.get('/', getVisitors);
router.get('/:id', getVisitor);
router.post('/', uploadSinglePhoto, createVisitor);
router.delete('/:id', deleteVisitor);
router.put('/:id',uploadSinglePhoto, updateVisitor);

module.exports = router;