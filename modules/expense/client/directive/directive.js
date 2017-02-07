angular.module('expenseTracker')
       .directive('chart', chart);

chart.$inject = [];

function chart () {
  return {
    restrict: 'E',
    templateUrl: 'modules/expense/client/views/partials/chart.html',
    scope: '@',
    transclude: true
  }
}


angular.module('expenseTracker')
       .directive('grid', grid);

grid.$inject = [];

function grid () {
  return {
    restrict: 'E',
    templateUrl: 'modules/expense/client/views/partials/grid.html',
    scope: '@',
    transclude: true
  }
}


angular.module('expenseTracker')
       .directive('headerCust', headerCust);

headerCust.$inject = [];

function headerCust () {
  return {
    restrict: 'E',
    templateUrl: 'modules/core/server/views/includes/header.html',
    scope: '@',
    transclude: true
  }
}
