'use strict';

var chartSettings = [{
    value: 'country',
    yValues: [ 'loan_amount', 'funded_amount']
  },{
    value: 'country',
    yValues: ['borrower_count']
  },{
    value: 'sector',
    yValues: [ 'loan_amount', 'funded_amount']
  },{
    value: 'partner_name',
    yValues: [ 'loan_amount', 'funded_amount']
  },{
    value: 'loan_amount',
    yValues: [ 'loan_amount', 'funded_amount']
  },{
    value: 'borrower_count',
    yValues: [ 'loan_amount', 'funded_amount']
  },{
    value: 'status',
    yValues: [ 'loan_amount', 'funded_amount']
  }
];

angular.module('myApp.charts', ['ngRoute','myApp.recent','angularCharts'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charts', {
    templateUrl: 'charts/charts.html',
    controller: 'ChartsCtrl'
  });
}])

.controller('ChartsCtrl',['$scope', 'Loans', function($scope, Loans) {
    $scope.data = [];
    $scope.config = [];

    $scope.selectedSort = 'newest';
    $scope.sortOptions = ['newest', 'popularity', 'loan_amount', 'expiration', 'oldest', 'amount_remaining', 'repayment_term', 'random'];

    $scope.search = function(){
      $scope.fetching = true;
      Loans.getNewLoans($scope.selectedSort).then(function(loans) {
        var dateRange = getDateRange(loans);

        _(chartSettings).each(function(chartSetting, k){
          $scope.data[k] = convertLoansToPieChartData(loans, chartSetting.value, chartSetting.yValues);

          $scope.config[k] = _.clone(baseConfig);
          $scope.config[k].title =  chartSetting.value + " " + dateRange.min +" to " + dateRange.max;
          $scope.fetching = false;
        });
      });

      $scope.chartType = 'bar';

      var baseConfig = {
        title: 'Recent Loan Listings', // chart title
        tooltips: true,
        labels: false, // labels on data points
        // legend config
        legend: {
          display: true, // can be either 'left' or 'right'.
          position: 'right',
        },
        // override this array if you're not happy with default colors
        colors: [],
        innerRadius: 10,        // Only on pie Charts
        lineLegend: 'lineEnd',  // Only on line Charts
        lineCurveType: 'cardinal', // change this as per d3 guidelines to avoid smoothline
        isAnimate: false,        // run animations while rendering chart
        yAxisTickFormat: 's', //refer tickFormats in d3 to edit this value
        xAxisMaxTicks: 7 // Optional: maximum number of X axis ticks to show if data points exceed this number
      };
    };

    $scope.search();

}]);

var getDateRange = function(loans){
  var dateRange = {min:null, max: null};

  dateRange.min = new Date(_.min(loans, function(loan){
    return Date.parse(loan.posted_date);
  }).posted_date).toDateString();

  dateRange.max = new Date(_.max(loans, function(loan){
    return Date.parse(loan.posted_date);
  }).posted_date).toDateString();

  return dateRange;
};

var convertLoansToPieChartData = function(data, xKey, yKeys){
  var formattedData = {
    series: yKeys,
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

    _(yKeys).each(function(yKey){
      y.push(_(value).reduce(function(memo, value){ return memo + value[yKey]; }, 0));
    });

    formattedData.data.push({
      x: key,
      y: y,
      tooltip: key + (y[1]? ' ratio: %' + Math.round(100 * y[1]/y[0]) : ' '+ y[0])
    });
  });


  // Sort data for chart.
  // If the x value is an integer, sort by that, else sort by y value.
  formattedData.data = _(formattedData.data).sortBy(function(data){
    if(isNaN(data.x)){
      return data.y[0];
    } else{
      return parseInt(data.x);
    }
  });

  return formattedData;
};

