// Dependencies
const express = require('express');
const router = express.Router();
const q = require('q');
const auth = require('../config/auth');
const constant = require('../lib/constant');
const dbContext = require('../lib/dbContext');
const errorHelper = require('../lib/errorHelper');
const productService = require('../services/productService');

// Router
router.get('/items', auth.checkAuthentication(), async function (req, res, next) {
	try
	{
		let query = req.query;
		let products = await productService.getProducts();
		res.status(200).json(products);
	}
	catch(err){
		next(err);
	}	
});

router.get('/item', auth.checkAuthentication(), function (req, res, next) {
	var productId = req.params.id;
	
	var ctx = {};
	dbContext.getConnection().then(function (result) {
		ctx = result;
		// TO DO: getProductById() || getProductsByBrand()
		return productService.getProductById(ctx, productId);
	}).then(function (products) {
		if (products.length == 0) {
			res.status(404).json(errorHelper.Error_Not_Exist_ProductId);
		} else {
			res.status(200).json(products[0]);
		}
	}).catch(function (error) {
		next(error);
	}).done(function () {
		ctx.release();
	});
});

// router.get('/items/:id', auth.checkAuthentication(), function (req, res, next) {
// 	var brandId = req.params.id;
	
// 	var ctx = {};
// 	dbContext.getConnection().then(function (result) {
// 		ctx = result;
// 		return productService.getProductsByBrand(ctx, brandId);
// 	}).then(function (products) {
// 		res.status(200).json(products)
// 	}).catch(function (error) {
// 		next(error);
// 	}).done(function () {
// 		ctx.release();
// 	});
// });

// return Router
module.exports = router;