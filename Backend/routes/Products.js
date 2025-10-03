const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST route to save products for a company
router.post('/', async (req, res) => {
  try {
    const { companyName, products } = req.body;

    // Validate input
    if (!companyName || !products || !Array.isArray(products)) {
      return res.status(400).json({ 
        success: false,
        error: 'Company name and products array are required' 
      });
    }

    // Check if products already exist for this company
    let productDoc = await Product.findOne({ companyName });

    if (productDoc) {
      // Update existing products by adding new ones
      productDoc.products = [...productDoc.products, ...products];
    } else {
      // Create new product document
      productDoc = new Product({
        companyName,
        products
      });
    }

    await productDoc.save();

    res.status(201).json({
      success: true,
      message: 'Products saved successfully',
      data: productDoc
    });

  } catch (error) {
    console.error('Error saving products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// GET products by company name
router.get('/:companyName', async (req, res) => {
  try {
    const companyName = decodeURIComponent(req.params.companyName);
    const productDoc = await Product.findOne({ companyName });

    if (!productDoc) {
      return res.status(404).json({
        success: false,
        error: 'No products found for this company'
      });
    }

    res.json({
      success: true,
      count: productDoc.products.length,
      products: productDoc.products
    });

  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: err.message
    });
  }
});

module.exports = router;

