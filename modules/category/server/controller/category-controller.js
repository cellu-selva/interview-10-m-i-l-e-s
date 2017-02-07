'use strict';

var  mongoose = require('mongoose'),
category = require('./../schema/category-schema');


module.exports = {

    saveOrUpdateCategory: function (req, res) {
      console.log(req.body);
      var Category = new category(req.body);
      Category.save(function(err, savedCategory){
        if(err) {
          return res.status(400)
             .json({
               'message': 'Error while saving or updating category'
             });
        }
        res.status(200)
           .json({
             'data': savedCategory
           });
      });
    },
    getCategoryById: function (req, res) {
      req.assert('_id', '_id required').notEmpty();
      req.getValidationResult().then(function(result) {}, function error(result) {
          return res.status(400)
           .json({
             'message': result
           });
      });
      category.findOne({
        _id: req.params.categoryId
      }, function(err, category){
        if(err) {
          return res.status(400)
             .json({
               'message': 'Error while getting category by id'
             });
        }
        res.status(200)
           .json({
             'data': category
           });
      });
    },
    getAllCategories: function (req, res) {
      category.find({}, function(err, categories){
        if(err) {
          return res.status(400)
             .json({
               'message': 'Error while fetching categories'
             });
        }
        res.status(200)
           .json({
             'data': categories
           });
        });
    }
};
