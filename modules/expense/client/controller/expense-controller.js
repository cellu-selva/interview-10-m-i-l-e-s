angular.module('expenseTracker')
       .controller('expenseTrackerController', expenseTrackerController);


expenseTrackerController.$inject = ['expenseService', '$mdDialog', '$log', 'categoryService', '$timeout', 'dataService', '$mdToast'];

function expenseTrackerController (expenseService, $mdDialog, $log, categoryService, $timeout, dataService, $mdToast) {
  var vm = this;
  vm.expense = dataService.expense;
  vm.expenses = dataService.expenses;
  vm.categories = [];

  $timeout(function(){
    console.log(vm.expenses);
  }, 3000)


  vm.createExpense = function (expense) {
    expense.createdAt = new Date();
    expenseService.createExpense(expense).then(function(res){
      vm.close();
      showToast('Expense created successfully.');
    }, function(err){
      showToast('Failed to create Expense.');
    });
  }

  vm.updateExpense = function (expense) {
    expense.updatedAt.push(new Date());
    expenseService.updateExpense(expense).then(function(res){
      showToast('Expense updated successfully.');
    }, function(err){
      showToast('Failed to updated category.');
    });
  }

  vm.deleteExpense = function (expense) {
    expenseService.deleteExpense(expense).then(function(res){
      showToast('expense deleted successfully.');
    }, function(err){
      showToast('Failed to deleted category.');
    });
  }

  vm.getExpense = function (expense) {
    expenseService.getExpense(expense);
  }

  vm.getAllExpenses = function () {
    expenseService.getAllExpenses().then(function(res){
      vm.expenses = res.data;
      //formatExpense(vm.expenses);
    });
  }

  vm.renderChart = function(){
    vm.getAllExpenses();
    $timeout(function () {
      renderPieChart();
    }, 1000);
  }

  vm.getAllCategories = function () {
    categoryService.getAllCategories().then(function(response){
      vm.categories = loadAll(response.data);
      showToast('Category created successfully.');
    }, function(err){
      showToast('Failed to create category.');
    });
  }

  vm.createCategory = function (category) {
    categoryService.createCategory({name: category}).then(function(res){
      vm.categories.push(res.data);
      vm.expense.category.name = res.data.name;
      showToast('Category created successfully.');
    }, function(err){
      showToast('Failed to create category.');
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
    vm.isSelectedItemChangeTriggered = true;
    vm.expense.category = dataService.getItemById('categories', item.value);
    $log.info('Item changed to ' + JSON.stringify(item));
    $timeout(function () {
      vm.isSelectedItemChangeTriggered = false;
    });
  }

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

  var renderPieChart = function() {
    var pieChart = dc.pieChart("#pie-chart");
    var chart = dc.barChart("#bar-chart");

    _.each(vm.expenses, function(expense){
      var date = new Date(expense.createdAt);
      expense.formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    });
    var crossfilterData   = crossfilter(vm.expenses);
    var categoryDimension    = crossfilterData.dimension(function(d) {return d.category.name;});
    var amountGroup   = categoryDimension.group().reduceSum(function(d) {return d.amount;});
    var dateDimension    = crossfilterData.dimension(function(d) {return d.formattedDate;});
    var amountDateGroup   = dateDimension.group().reduceSum(function(d) {return d.amount;});

    var maxDate = dateDimension.bottom(1)[0].formattedDate;
    var minDate= dateDimension.top(1)[0].formattedDate;
    var pieTip = d3.tip().attr('class', 'd3-tip').offset([0, 0 ]).html(
        function(d) {
            //Checking for empty data
           if(d.data.key =="empty"){
              return "<span class='tooltip-color'  style='color:#000000;'> Amount spend: " + (d.value ) + " <span>";
           }else{
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
    console.log(minDate, maxDate);

    pieChart
        .width(500)
        .height(400)
        .slicesCap(10)
        .colors( d3.scale.ordinal().range(["#81d4fa","#71ead2","#1c84c6","#79D2C0","#1AB394","#9DC7E1","#117560"]))
        .renderLabel(true)
        .dimension(categoryDimension)
        .group(amountGroup)
        .legend(dc.legend())
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            })
        });
      pieChart.render();

      // chart
      //   .width(768)
      //   .height(480)
      //   .x(d3.time.scale().domain([ maxDate, minDate ]))
      //   //.x(d3.scale.linear().domain([new Date(minDate),new Date(maxDate)]))
      //   .brushOn(false)
      //   .yAxisLabel("This is the Y Axis!")
      //   .dimension(dateDimension)
      //   .group(amountDateGroup)
      //   .on('renderlet', function(chart) {
      //       chart.selectAll('rect').on("click", function(d) {
      //           console.log("click!", d);
      //       });
      //   });
      //   chart.render();


        d3.selectAll("g.pie-slice").call(pieTip);
        d3.selectAll("g.pie-slice").on('mouseover', pieTip.show).on('mouseout',pieTip.hide);
        d3.selectAll("g.pie-slice path").on('mouseover',function() {
                $(".d3-tip").css("border-color",rgbToHex($(this).css('fill')));
                $(".d3-tip").css("color", '#FFFFFF');
                d3.select(this).attr('transform', "scale(1.01)");
        }).on("mouseout",function(){d3.select(this).attr('transform', "scale(1.00)");});

    };
}
