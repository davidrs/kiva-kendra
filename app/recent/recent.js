'use strict';

angular.module('myApp.recent', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recent', {
    templateUrl: 'recent/recent.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',['$scope',  'Loans', function($scope, Loans) {

  Loans.getLoans().then(function(loans) {
    $scope.loans = loans;
  });

  $scope.orderProp = 'loan_amount';

}]).
factory('Loans', ['$resource', '$http', function($resource, $http) {
  var KENDRA_REGIONS = ['AL','AM','AZ','GE','MD','MN','KG','TJ','UA', 'XK'].join(',');
  var request = null;

//
//http://api.kivaws.org/v1/partners.json
  return {
    getLoans: function(){
      if(request === null){
        request = $http({
         method: 'GET',
         url: 'recent/search.json', 
         // url: 'http://api.kivaws.org/v1/loans/search.json', //
         params:{per_page:40, country_code: KENDRA_REGIONS}
        }).then(function(response){
          return response.data.loans;
        });
      }
      return request;
    }
  }
}]);
