/**
 * 
 * Module  : expenseTracker
 * @name [expenseService]
 * @author [selvanathan] 
 * 
 */
angular.module('expenseTracker')
       .service('expenseService', expenseService);

/**
 * [$inject expenseService dependency injection]
 * @type {Array}
 */
expenseService.$inject = ['dataService', 'expenseFactory', '$log', '$q', '$http'];

/**
 * [expenseService description]
 * @param  {[angular custom service]} dataService        [description]
 * @param  {[angular custom service]} expenseFactory     [description]
 * @param  {[angular built-in service]} $log             [description]
 * @param  {[angular built-in service]} $q               [description]
 * @param  {[angular built-in service]} $http          [description]
 * @return {[type]}                [description]
 */
function expenseService (dataService, expenseFactory, $log, $q, $http) {
  var self = this;
  var expenseFactoryObject = new expenseFactory();

  /**
   * [createExpense Service that hold the expense factoy for creating the expense]
   * @param  {[type]} expense [description]
   * @return {[type]}         [description]
   */
  self.createExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactory.save(expense, function(response){
      deffered.resolve(response);
      dataService.addItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error saving expense :: ", err);
    });
    return deffered.promise;
  };

  /**
   * [updateExpense  Service that hold the expense factoy for updating the expense]
   * @param  {[type]} expense [description]
   * @return {[type]}         [description]
   */
  self.updateExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactory.update(expense, function(response){
      deffered.resolve(response);
      dataService.updateItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error updating expense :: ", err);
    });
    return deffered.promise;
  };

  /**
   * [deleteExpense  Service that hold the expense factoy for deleting the expense]
   * @param  {[type]} expense [description]
   * @return {[type]}         [description]
   */
  self.deleteExpense = function (expense) {
    var deffered = $q.defer();
    expense.isDeleted = true;
    expenseFactory.update(expense, function(response){
      deffered.resolve(response);
      dataService.updateItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error deleting expense :: ", err);
    });
    return deffered.promise;
  };

  /**
   * [getExpense  Service that hold the expense factoy for getting expense by id]
   * @param  {[type]} expense [description]
   * @return {[type]}         [description]
   */
  self.getExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactoryObject.$get({'expenseId': expense}, function(response){
      deffered.resolve(response);
      dataService.addItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching expense :: ", err);
    });
    return deffered.promise;
  };

  /**
   * [getAllExpenses  Service that hold the expense factoy for getting all the expense]
   * @return {[type]} [description]
   */
  self.getAllExpenses = function () {
    var deffered = $q.defer();
    expenseFactoryObject.$get(function(response){
      dataService.addItems('expenses', response.data);
      deffered.resolve(response);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching expenses :: ", err);
    });
    return deffered.promise;
  };

  self.getStatsData = function(data){
    var deffered = $q.defer();
    $http({
      'method': 'GET',
      'url': 'api/expense/stats/chart',
      'params': data
    }).success(function(response){
      dataService.addItems('expenses', response.data);
      deffered.resolve(response);
    });
    return deffered.promise;
  }
}

/**
 * [expenseFactory creates expense restfull objects]
 * @param  {[type]} $resource) [angular built in service]
 * @return {[type]}  
 */
angular.module('expenseTracker').factory('expenseFactory', ['$resource',
  function($resource) {
    return $resource('api/expense/:expenseId',{
      expenseId: '@_id'
    },
      {
        update: {
          method: 'PUT'
        }
    });
  }]);
