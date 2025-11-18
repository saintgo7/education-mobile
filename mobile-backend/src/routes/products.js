const express = require('express');
const productsController = require('../controllers/productsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/search', productsController.searchProducts);
router.get('/categories', productsController.getCategories);
router.get('/:id', productsController.getProductById);
router.post('/', protect, productsController.createProduct);
router.put('/:id', protect, productsController.updateProduct);
router.delete('/:id', protect, productsController.deleteProduct);

module.exports = router;
