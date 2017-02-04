'use strict';

var  mongoose = require('mongoose'),
expenseSchema = require('./../schema/expense-schema');


module.exports = {
  saveOrUpdateExpense: function (req, res) {
    var expense = req.body;
    expense.save(function(err, savedExpense){
      if(err) {
        return res.status(400)
           .json({
             error: 'Error saving or updating expense data'
           });
      }
      res.status(200)
         .json({
           data: savedExpense
         });
    });
  },
  getExpenseById:  function (req, res) {
    req.assert('expenseId', '_id required').notEmpty();
    req.getValidationResult().then(function(result) {}, function error(result) {
        return res.status(400)
         .json({
           'message': result
         });
    });
    expenseSchema.find({
      '_id':  req.params.expenseId
    }, function(err, expensessss){
      console.log(err, expensessss);
      if(err) {
        return res.status(400)
           .json({
             'message': 'Error while getting expense by id'
           });
      }
      res.status(200)
         .json({
           'data': expensessss
         });
    });
  },
  getAllExpenses: function (req, res) {
    expenseSchema.find({}, function(err, expenses){
      if(err) {
        return res.status(400)
           .json({
             'message': 'Error while fetching expenses'
           });
      }
      res.status(200)
         .json({
           'data': expenses
         });
    });
  },
  deleteExpense: function (req, res) {
    req.assert('_id', '_id required').notEmpty();
    req.getValidationResult().then(function(result) {}, function error(result) {
        return res.status(400)
         .json({
           'message': result
         });
    });
    expenseSchema.findOneAndUpdate({
      _id: req.params.expenseId
    }, {
      $set: {
        'isDeleted': true
      }
    }, function(err, deletedExpense){
      if(err) {
        return res.status(400)
           .json({
             'message': 'Error while deleting expense'
           });
      }
      res.status(200)
         .json({
           'data': deletedExpense
         });
    });
  },
  getExpenseDataForStats: function (req, res) {
    req.assert('fromDate', 'fromDate required').notEmpty();
    req.assert('toDate', 'toDate required').notEmpty();
    req.getValidationResult().then(function(result) {}, function error(result) {
        return res.status(400)
         .json({
           'message': result
         });
    });
    expenseSchema.find({
      'createdAt': {
        '$gte': new Date(req.body.fromDate),
        '$lte': new Date(req.body.toDate)
      }
    }, function(err, statsData){
      if(err) {
        return res.status(400)
           .json({
             'message': 'Error while fetching data for stats'
           });
      }
      res.status(200)
         .json({
           'data': statsData
         });
    });
  }
}
