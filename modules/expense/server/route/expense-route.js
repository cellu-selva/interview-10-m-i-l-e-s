'use strict';
var express = require('express'),
expenseController = require('./../controller/expense-controller');

module.exports = (function(){
  var router = express.Router();

  router.get('/:expenseId', expenseController.getExpenseById)
        .put('/:expenseId', expenseController.updateExpense)
        .delete('/:expenseId', expenseController.deleteExpense);

  router.post('/', expenseController.saveExpense)
        .get('/', expenseController.getAllExpenses);

  router.get('/stats/chart', expenseController.getExpenseDataForStats);

  return router;

})();
