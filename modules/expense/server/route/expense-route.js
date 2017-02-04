'use strict';
var express = require('express'),
expenseController = require('./../controller/expense-controller');

module.exports = (function(){
  var router = express.Router();

  router.get('/:expenseId', expenseController.getExpenseById)
        .put('/:expenseId', expenseController.saveOrUpdateExpense)
        .delete('/:expenseId', expenseController.deleteExpense);

  router.post('/', expenseController.saveOrUpdateExpense)
        .get('/', expenseController.getAllExpenses);

  router.get('/stats/chart', expenseController.getExpenseDataForStats);

  return router;

})();
