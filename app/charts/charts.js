'use strict';

angular.module('myApp.charts', ['ngRoute','myApp.recent','angularCharts'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charts', {
    templateUrl: 'charts/charts.html',
    controller: 'ChartsCtrl'
  });
}])

.controller('ChartsCtrl',['$scope', 'Loans', function($scope, Loans) {

console.log('runController');

  var convertLoansToPieChartData = function(data, xKey, yKey, yKey2){
    var formattedData = {
      series: ["loan_amount", "funded_amount"],
      data: []
    };

    // Aggregate to yKey to xKey.
    if(data[0][xKey] && typeof data[0][xKey] !=  'object'){
      data = _(data).groupBy(function(d){return d[xKey];});
    } else if (xKey == 'country') {
      data = _(data).groupBy(function(d){return d.location.country;});
    }


    _(data).map(function(value, key){
      var y = [];
      y[0] = _(value).reduce(function(memo, value){ return memo + value[yKey]; }, 0);
      if(yKey2){
        y[1] = _(value).reduce(function(memo, value){ return memo + value[yKey2]; }, 0);
      }

      formattedData.data.push({
        x: key,
        y: y,
        tooltip: key + ' ratio: %' + Math.round(100*y[1]/y[0])
      });
    });

    formattedData.data = _(formattedData.data).sortBy(function(data){
      return data.y[0];
    });

    console.log('formattedData', formattedData);
    return formattedData;
  };

  setInterval(function(){
    Loans.getLoans().then(function(loans) {
      $scope.data = convertLoansToPieChartData(loans, 'country', 'loan_amount', 'funded_amount');
      $scope.data2 = convertLoansToPieChartData(loans, 'sector', 'loan_amount', 'funded_amount');
      $scope.data3 = convertLoansToPieChartData(loans, 'loan_amount', 'loan_amount', 'funded_amount');
      $scope.data4 = convertLoansToPieChartData(loans, 'partner_name', 'loan_amount', 'funded_amount');


      var minDate = new Date(_.min(loans, function(loan){
        return Date.parse(loan.posted_date);
      }).posted_date).toDateString();
      var maxDate = new Date(_.max(loans, function(loan){
        return Date.parse(loan.posted_date);
      }).posted_date).toDateString();

      $scope.config.title = "country from: " + maxDate +" to " +minDate;
      $scope.config2.title = "sector from: " + maxDate +" to " +minDate
      $scope.config3.title = "loan_amount from: " + maxDate +" to " +minDate
      $scope.config4.title = "partner_id from: " + maxDate +" to " +minDate
    });
  }, 3000);

  $scope.chartType = 'bar';
  $scope.config = {
    title: 'Recent Loan Listings', // chart title
    tooltips: true,
    labels: false, // labels on data points
    // exposed events
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    // legend config
    legend: {
      display: true, // can be either 'left' or 'right'.
      position: 'right',
    },
    // override this array if you're not happy with default colors
    colors: [],
    innerRadius: 10, // Only on pie Charts
    lineLegend: 'lineEnd', // Only on line Charts
    lineCurveType: 'cardinal', // change this as per d3 guidelines to avoid smoothline
    isAnimate: false, // run animations while rendering chart
    yAxisTickFormat: 's', //refer tickFormats in d3 to edit this value
    xAxisMaxTicks: 7 // Optional: maximum number of X axis ticks to show if data points exceed this number
  };
  $scope.config2 = _.clone($scope.config);
  $scope.config3 = _.clone($scope.config);
  $scope.config4 = _.clone($scope.config);


}]);
