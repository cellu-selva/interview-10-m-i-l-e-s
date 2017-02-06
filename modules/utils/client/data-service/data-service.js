angular.module('expenseTracker')
       .service('dataService', dataService);

dataService.$inject = [];

function dataService () {
  var self = this;
  self.expenses = [];
  self.categories = [];
  self.formattedExpenses = [];

  self.getItemById = function(property, id) {
    var index = getIndexById(self[property], id);
    if(index > -1)
      return self[property][index];
  };

  self.updateItem = function(property, value) {
    var index = getIndexById(self[property], value._id);
    if(!value.isDeleted && index > -1){
      _.extend(self[property][index], value);
    } else if(index > -1){
      self[property].splice(index, 1);
    }
  }

  self.addItem = function(property, value) {
    self[property].push(value);
  }

  self.addItems = function(property, values) {
    _.extend(self[property],values);
  }

  function getIndexById ( collection, id) {
    return _.findIndex(collection, {
      _id: id
    });
  }
}
