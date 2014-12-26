'use strict';

angular.module('myApp.charts', ['ngRoute','myApp.recent','angularCharts'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charts', {
    templateUrl: 'charts/charts.html',
    controller: 'ChartsCtrl'
  });
}])

.controller('ChartsCtrl',['$scope', 'Loans', function($scope, Loans) {
  var convertLoansToPieChartData = function(data, xKey, yKey){
    var formattedData = {
      series: ["Loans"],
      data: []
    };

    // Aggregate to yKey to xKey.
    data = _(data).groupBy(function(d){return d.location.country;});
    _(data).map(function(value, key){
      console.log('value, key', value,  key);
      value = _(value).reduce(function(memo, value){ return memo + value[yKey]; }, 0);
      formattedData.data.push({
        x: key,
        y: [value],
        tooltip: key + ': $' + value
      });
    });

    console.log('formattedData', formattedData);
    return formattedData;
  };

  Loans.getLoans().then(function(loans) {
    $scope.data = convertLoansToPieChartData(loans, 'country', 'loan_amount');
  });

  $scope.chartType = 'pie';

  $scope.data = {
    series: ["Sales", "Income", "Expense"],
    data: [{
      x: "Computers",
      y: [54, 0, 879],
      tooltip: "This is a tooltip"
    }]
  };


  $scope.config = {
    title: 'Recent Loan Listings', // chart title
    tooltips: true,
    labels: true, // labels on data points
    // exposed events
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    // legend config
    legend: {
      display: true, // can be either 'left' or 'right'.
      position: 'right',
      // you can have html in series name
      htmlEnabled: false
    },
    // override this array if you're not happy with default colors
    colors: [],
    innerRadius: 10, // Only on pie Charts
    lineLegend: 'lineEnd', // Only on line Charts
    lineCurveType: 'cardinal', // change this as per d3 guidelines to avoid smoothline
    isAnimate: true, // run animations while rendering chart
    yAxisTickFormat: 's', //refer tickFormats in d3 to edit this value
    xAxisMaxTicks: 7 // Optional: maximum number of X axis ticks to show if data points exceed this number
  };


}]);
