angular.module('expenseTracker')
       .directive('pieChart', pieChart);

pieChart.$inject = [];

function pieChart () {
  return {
    restrict: 'E',
    templateUrl: 'modules/expense/client/views/partials/pie-chart.html',
    scope: '@',
    transclude: true
  }
}

angular.module('expenseTracker')
       .directive('barchart', barchart);

barchart.$inject = [];

function barchart () {
  return {
    restrict: 'E',
    templateUrl: 'modules/expense/client/views/partials/bar-chart.html',
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
