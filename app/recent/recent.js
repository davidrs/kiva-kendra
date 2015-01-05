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

  $scope.$on('loans:updated', function(event,data) {
    $scope.loans = data;
  });

  $scope.orderProp = 'loan_amount';

}]);
