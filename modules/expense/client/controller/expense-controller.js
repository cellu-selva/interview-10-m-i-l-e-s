/**
 * 
 * Controller
 * Name: expenseTracker
 * Author: selvanathan
 * 
 */
angular.module('expenseTracker')
       .controller('expenseTrackerController', expenseTrackerController);

/**
 * [$inject description] Dependency injection for The expense tracker controller.
 * @type {Array}
 */
expenseTrackerController.$inject = ['expenseService', '$mdDialog', '$log', 'categoryService', '$timeout', 'dataService', '$mdToast', '$scope'];

/**
 * [expenseTrackerController description]  Actual expense controller definition.
 * @param  {[angular custom service]} expenseService    [description]  
 * @param  {[angular built-in service]} $mdDialog       [description]
 * @param  {[angular built-in service]} $log            [description]
 * @param  {[angular custom service]} categoryService   [description]
 * @param  {[angular built-in service]} $timeout        [description]
 * @param  {[angular custom service]} dataService       [description]
 * @param  {[angular built-in service]} $mdToast        [description]
 * @param  {[angular built-in service]} $scope          [description]
 * @return {[type]}                 [description]
 */
function expenseTrackerController (expenseService, $mdDialog, $log, categoryService, $timeout, dataService, $mdToast, $scope) {
  var vm = this;
  vm.name = 'sadsasdf'
  vm.expense = dataService.expense;
  vm.expenses = dataService.expenses;
  vm.categories = dataService.categories;
  vm.currentTab = 'grid';

  /**
   * [createExpense - Method that is binded to the view for creating expense ]
   * @param  {[type]} expense [ holds the current expense object ]
   * @return {[type]}         [description]
   */
  vm.createExpense = function (expense) {
    expense.createdAt = new Date();
    expenseService.createExpense(expense).then(function(res){
      vm.expense = null;
      vm.getAllExpenses();
      close();
      $log.info('Expense created successfully.');
    }, function(err){
      $log.info('Failed to create Expense.');
    });
  }

  /**
   * [updateExpense - Method that is binded to the view for updating expense ]
   * @param  {[type]} expense [ holds the current expense object ]
   * @return {[type]}         [description]
   */
  vm.updateExpense = function (expense) {
    expenseService.updateExpense(expense).then(function(res){
      close();
      $log.info('Expense updated successfully.');
    }, function(err){
      $log.info('Failed to updated category.');
    });
  }

  /**
   * [deleteExpense - Method that is binded to the view for deleting expense ]
   * @param  {[type]} expense [ holds the current expense object ]
   * @return {[type]}         [description]
   */
  vm.deleteExpense = function (expense) {
    expenseService.deleteExpense(expense).then(function(res){
      vm.expense = null;
      vm.getAllExpenses();
      $log.info('expense deleted successfully.');
    }, function(err){
      $log.info('Failed to deleted category.');
    });
  }

  /**
   * [getExpense - Method that is binded to the view for getting the expense by id ]
   * @param  {[type]} expense [holds the current expense object unique id]
   * @return {[type]}         [description]
   */
  vm.getExpense = function (expense) {
    expenseService.getExpense(expense);
  }

  /**
   * [getAllExpenses - Method that is binded to the view for getting all the expense]
   * @return {[type]} [description]
   */
  vm.getAllExpenses = function () {
    expenseService.getAllExpenses().then(function(res){
      vm.expenses = res.data;
    });
  }

  /**
   * [renderChart - Method that is binded to the view for invoking the chart rendering]
   * @return {[type]} [description]
   */
  vm.renderChart = function(){
    vm.getAllExpenses();
    $timeout(function () {
      renderPieChart('formattedDate');
    }, 1000);
  }
  /**
   * [getAllCategories -  Method that is binded to the view for getting all the categories]
   * @return {[type]} [description]
   */
  vm.getAllCategories = function () {
    categoryService.getAllCategories().then(function(response){
      vm.categories = loadAllCategoriesIntoDropDown(response.data);
      $log.info('Category created successfully.');
    }, function(err){
      $log.info('Failed to create category.');
    });
  }

  /**
   * [createCategory -  Method that is binded to the view for creating categories]
   * @param  {[type]} category [description]
   * @return {[type]}          [description]
   */
  vm.createCategory = function (category) {
    categoryService.createCategory({name: category}).then(function(res){
      var createdCategory = {
        display: res.data.name,
        value: res.data._id
      };
      vm.categories.push(createdCategory);
      vm.expense.category.name = res.data.name;
      angular.element('#category input').focus();
      $log.info('Category created successfully.');
    }, function(err){
      $log.info('Failed to create category.');
    });
  }

  /**
   * [close  Method that is use for closing the $md dialog that is open ]
   * @return {[type]} [description]
   */
  var close = function() {
    $mdDialog.hide();
  }

  /**
   * [querySearch - Query search is implemented for autocomplete drop down, which 
   * returns the matcing cases of the query typed by the users.]
   * @param  {[type]} query [description]
   * @return {[type]}       [description]
   */
  vm.querySearch = function (query) {
      return query ? vm.categories.filter( createFilterFor(query) ) : vm.categories;
  }

  /**
   * [searchTextChange - Method that log the search text on key down]
   * @param  {[type]} text [description]
   * @return {[type]}      [description]
   */
  vm.searchTextChange = function (text) {
    $log.info('Text changed to ' + text);
  }

  /**
   * [selectedItemChange - On selecting an option from the dropdown this method gets triggered]
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  vm.selectedItemChange = function (item) {
    vm.isSelectedItemChangeTriggered = true;
    vm.expense.category = dataService.getItemById('categories', item.value);
    $log.info('Item changed to ' + JSON.stringify(item));
    $timeout(function () {
      vm.isSelectedItemChangeTriggered = false;
    });
  }

  /**
   * [showAddExpenseDialog - A pop up will be rendered when this method gets invoked. 
   *   this makes use of angular $mddialog service for rendering the pop up]
   * @param  {[type]} ev   [event]
   * @param  {[type]} data [expense if this is called on update else null]
   * @return {[type]}      [description]
   */
  vm.showAddExpenseDialog = function(ev, data) {
    if(data){
      dataService.expense = data;
    }

    $mdDialog.show({
      controller: expenseTrackerController,
      controllerAs: 'expenseCtrl',
      templateUrl: 'modules/expense/client/views/partials/expense-dialog.html',
      targetEvent: ev,
      parent: angular.element('body'),
      clickOutsideToClose:true
    }, function(success){}, function (err){});
  }

  vm.setActiveTab = function (tab) {
    vm.currentTab = tab;
  }

  /**
   * [loadAllCategoriesIntoDropDown On initial load the category data will be formatted using this method]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function loadAllCategoriesIntoDropDown(data) {
    return data.map( function (category) {
      return {
        value: category._id,
        display: category.name
      };
    });
  }

  /**
   * [showToast This renders a toast message on view to acknowledge the user(s) action]
   * @param  {[type]} message [ Message to be displayed ]
   * @return {[type]}         [description]
   */
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

  /**
   * [renderPieChart renders the graph]
   * @return {[type]} [description]
   */
  var renderPieChart = function(type) {
    var query = {
      'startDate': vm.startDate || new Date(new Date() -  (24*60*60*1000) * 10),
      'endDate': vm.endDate || new Date()
    };
    expenseService.getStatsData(query).then(function(response){
      var pieChart = dc.pieChart("#pie-chart");
    var chart = dc.barChart("#bar-chart");
    var statsData = response.data;
    //Formatting the date
    _.each(statsData, function(expense){
      var date = new Date(expense.createdAt);
      expense.monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
      expense.formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });

    /**
     * Declaring the dimensions and grouping of data.
     */
    var crossfilterData   = crossfilter(statsData);
    var categoryDimension    = crossfilterData.dimension(function(d) {return d.category.name;});
    var amountGroup   = categoryDimension.group().reduceSum(function(d) {return d.amount;});
    var dateDimension    = crossfilterData.dimension(function(d) {return d[type];});
    var amountDateGroup   = dateDimension.group().reduceSum(function(d) {return d.amount;});

    //Getting the min and max date from the grouped data
    var minDate = dateDimension.bottom(1)[0][type];
    var maxDate= dateDimension.top(1)[0][type];

    //Tool tip for rendering on hover to the graph elements
    var pieTip = d3.tip().attr('class', 'd3-tip').offset([0, 0 ]).html(
        function(d) {
            //Checking for empty data
           if(d.data.key =="empty"){
              return "<span class='tooltip-color'  style='color:#000000;'> Amount spend: " + (d.value ) + " <span>";
           } else {
             //formatting tool tip that has data above thousand
               if(d.value >1000)
                   return "<span class='tooltip-color'  style='color:#000000;'> Category: "+ d.data.key + "<br> Amount spend: " + (d.value/1000) + "K <span>";
               else
                   return "<span class='tooltip-color'  style='color:#000000;'> Category: "+ d.data.key + "<br> Amount spend: " + (d.value ) + " <span>";
           }
    });

        //Rgb color code to hex code.
    function rgbToHex(orig) {
        var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
        return (rgb && rgb.length === 4) ? "#"
                + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2)
                + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2)
                + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
    }

    pieChart
        .width(500)
        .height(400)
        .slicesCap(10)
        .colors( d3.scale.ordinal().range(["#509baf","#71ead2","#1c84c6","#79D2C0","#1AB394","#9DC7E1","#117560"]))
        .renderLabel(false)
        .dimension(categoryDimension)
        .group(amountGroup)
        .legend(dc.legend());

      pieChart.render();


      chart
        .width(600)
        .height(400)        
        //.x(d3.time.scale().domain([ maxDate, minDate ]))
        .x(d3.time.scale().domain([ minDate, maxDate ]))
        .brushOn(false)
        .clipPadding(30)
        .renderHorizontalGridLines(true)
        .mouseZoomable(true)
        .elasticY(true)
        .xAxisLabel('Date')
        .xUnits(function(){return 10;})
        .dimension(dateDimension)
        .group(amountDateGroup);

      chart.render();


      //Selecting the dom elements and attaching events SS
      d3.selectAll("g.pie-slice").call(pieTip);
      d3.selectAll("g.pie-slice").on('mouseover', pieTip.show).on('mouseout',pieTip.hide);
      d3.selectAll("g.pie-slice path").on('mouseover',function() {
              $(".d3-tip").css("background-color",rgbToHex($(this).css('fill')));
              $(".d3-tip").css("color", '#FFFFFF');
              d3.select(this).attr('transform', "scale(1.01)");
      }).on("mouseout",function(){d3.select(this).attr('transform', "scale(1.00)");});
    },function(err){
      $log.info('Error fetching data for statsitics');
    });

    };
}
