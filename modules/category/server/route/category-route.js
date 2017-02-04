'use strict';
var express = require('express');
var category = require('./../controller/category-controller.js');

module.exports = (function() {

    var router = express.Router();

    router.post('/', category.saveOrUpdateCategory)
          .get('/', category.getAllCategories);
    router.get('/:categoryId', category.getCategoryById);


    return router;
})();
