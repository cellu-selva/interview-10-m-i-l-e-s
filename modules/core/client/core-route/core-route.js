angular
    .module('expenseTracker')
    .config(['$stateProvider', '$urlRouterProvider', '$qProvider', function($stateProvider, $urlRouterProvider, $qProvider) {
        $stateProvider
            .state('expense', {
                url: '/',
                templateUrl: 'modules/expense/client/views/expense-tracker.html',
                controller: 'expenseTrackerController',
                controllerAs: 'expenseCtrl'
            });

        $urlRouterProvider.otherwise('/');
    }]);
