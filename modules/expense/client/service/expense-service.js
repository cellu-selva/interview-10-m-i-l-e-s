angular.module('expenseTracker')
       .service('expenseService', expenseService);

expenseService.$inject = ['dataService', 'expenseFactory', '$log', '$q'];

function expenseService (dataService, expenseFactory, $log, $q) {
  var self = this;

  //expenseFactory = new expenseFactory();

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

  self.updateExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactory.$update(expense, function(response){
      deffered.resolve(response);
      dataService.updateItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error updating expense :: ", err);
    });
    return deffered.promise;
  };

  self.deleteExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactory.$delete(expense, function(response){
      deffered.resolve(response);
      dataService.updateItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error deleting expense :: ", err);
    });
    return deffered.promise;
  };

  self.getExpense = function (expense) {
    var deffered = $q.defer();
    expenseFactory.get({'expenseId': expense}, function(response){
      deffered.resolve(response);
      dataService.addItem('expenses', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching expense :: ", err);
    });
    return deffered.promise;
  };

  self.getAllExpenses = function () {
    var deffered = $q.defer();
    expenseFactory.get(function(response){
      dataService.addItems('expenses', response.data);
      deffered.resolve(response);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching expenses :: ", err);
    });
    return deffered.promise;
  };
}

angular.module('expenseTracker').factory('expenseFactory', ['$resource',
  function($resource) {
    return $resource('api/expense/:expenseId', {
      expenseId: '@_id'
    });
  }]);
