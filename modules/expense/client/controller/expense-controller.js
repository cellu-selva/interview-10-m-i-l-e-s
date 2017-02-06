angular.module('expenseTracker')
       .controller('expenseTrackerController', expenseTrackerController);


expenseTrackerController.$inject = ['expenseService', '$mdDialog', '$log', 'categoryService', '$timeout', 'dataService'];

function expenseTrackerController (expenseService, $mdDialog, $log, categoryService, $timeout, dataService) {
  var vm = this;
  vm.expenses = dataService.expenses;

  $timeout(function(){
    console.log(vm.expenses);
  }, 3000)


  vm.createExpense = function (expense) {
    expense.createdAt = new Date();
    expenseService.createExpense(expense).then(function(res){
      vm.close();
      //showToast('Expense created successfully.');
    }, function(err){
      //showToast('Failed to create Expense.');
    });
  }

  vm.updateExpense = function (expense) {
    expense.updatedAt.push(new Date());
    expenseService.updateExpense(expense).then(function(res){
      //showToast('Expense updated successfully.');
    }, function(err){
      //showToast('Failed to updated category.');
    });
  }

  vm.deleteExpense = function (expense) {
    expenseService.deleteExpense(expense).then(function(res){
      //showToast('expense deleted successfully.');
    }, function(err){
      //showToast('Failed to deleted category.');
    });
  }

  vm.getExpense = function (expense) {
    expenseService.getExpense(expense);
  }

  vm.getAllExpenses = function () {
    expenseService.getAllExpenses().then(function(){
      formatExpense(vm.expenses);
    });
  }

  vm.renderChart = function(){
    renderPieChart();
    //renderBarChart();
  }

  vm.getAllCategories = function () {
    categoryService.getAllCategories().then(function(response){
      vm.categories = loadAll(response.data);
      //showToast('Category created successfully.');
    }, function(err){
      //showToast('Failed to create category.');
    });
  }

  vm.createCategory = function (category) {
    categoryService.createCategory({name: category}).then(function(res){
      //showToast('Category created successfully.');
    }, function(err){
      //showToast('Failed to create category.');
    });
  }

  vm.close = function(){
    $mdDialog.hide();
  }

  vm.querySearch = function (query) {
      return query ? vm.categories.filter( createFilterFor(query) ) : vm.categories;
  }

  vm.searchTextChange = function (text) {
    $log.info('Text changed to ' + text);
  }

  vm.selectedItemChange = function (item) {
    vm.expense.category = dataService.getItemById('categories', item.value);
    $log.info('Item changed to ' + JSON.stringify(item));
  }

  vm.showAddExpenseDialog = function(ev) {
      $mdDialog.show({
        controller: expenseTrackerController,
        controllerAs: 'expenseCtrl',
        templateUrl: 'modules/expense/client/views/partials/expense-dialog.html',
        targetEvent: ev,
        parent: angular.element('body'),
        clickOutsideToClose:true
      }, function(success){}, function (err){});
  }

  /**
   * Build `states` list of key/value pairs
   */
  function loadAll(data) {
    return data.map( function (expense) {
      return {
        value: expense._id,
        display: expense.name
      };
    });
  }

  function formatExpense (expenses){
    _.each(expenses, function(expense){
       expense.category = expense.category.name;
   });
 }

  function showToast(message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('top right' )
        .hideDelay(2000)
    );
  }

  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(expense) {
      return (expense.display.indexOf(lowercaseQuery) === 0);
    };

  }

  var chart = dc.pieChart("#pie-chart");
  var crossfilterData = crossfilter(vm.expenses),
  dimension = crossfilterData.dimension(function(d) {return d.category;}),
  group = dimension.group().reduceSum(function(d) {return d.amount;});
  var renderPieChart = function() {

        chart
            .width(angular.element('#pie-chart').width())
            .height(400)
            .slicesCap(4)
            .innerRadius(100)
            .dimension(dimension)
            .group(group)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                })
            });
          chart.render();
  }

}
