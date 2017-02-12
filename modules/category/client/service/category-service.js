angular.module('expenseTracker')
       .service('categoryService', categoryService);

categoryService.$inject = ['dataService', 'categoryFactory', '$log', '$q'];

function categoryService (dataService, categoryFactory, $log, $q) {
  var self = this;

  //categoryFactory = new categoryFactory();

  self.createCategory = function (category) {
    var deffered = $q.defer();
    categoryFactory.save(category, function(response){
      deffered.resolve(response);
      dataService.addItem('categories', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error saving category :: ", err);
    });
    return deffered.promise;
  };

  self.updateCategory = function (category) {
    var deffered = $q.defer();
    categoryFactory.update(category, function(response){
      deffered.resolve(response);
      dataService.updateItem('categories', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error updating category :: ", err);
    });
    return deffered.promise;
  };

  self.deleteCategory = function (category) {
    var deffered = $q.defer();
    categoryFactory.delete(category, function(response){
      deffered.resolve(response);
      dataService.updateItem('categories', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error deleting category :: ", err);
    });
    return deffered.promise;
  };

  self.getCategory = function (category) {
    var deffered = $q.defer();
    categoryFactory.get({'categoryId': category}, function(response){
      deffered.resolve(response);
      dataService.addItem('categories', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching category :: ", err);
    });
    return deffered.promise;
  };

  self.getAllCategories = function () {
    var deffered = $q.defer();
    categoryFactory.get(function(response){
      deffered.resolve(response);
      dataService.addItems('categories', response.data);
    }, function(err){
      deffered.reject(err);
      $log.info("Error fetching categorys :: ", err);
    });
    return deffered.promise;
  };

}

angular.module('expenseTracker').factory('categoryFactory', ['$resource',
  function($resource) {
    return $resource('api/category/:categoryId', {
      categoryId: '@_id'
    });
  }]);
