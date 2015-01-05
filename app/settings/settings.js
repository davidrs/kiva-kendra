
angular.module('myApp.settings', ['ngRoute','myApp.recent','angularCharts'])

.directive('searchSettings', function(){
  return {
    restrict: 'E',
    templateUrl: 'settings/settings.html'
  };
})
.controller('SettingsController', ['$scope', 'Loans', function($scope, Loans) {

  console.log('SettingsController');
  $scope.selectedSort = 'newest';
  $scope.sortOptions = ['newest', 'popularity', 'loan_amount', 'expiration', 'oldest', 'amount_remaining', 'repayment_term', 'random'];


  $scope.search = function(){
    $scope.fetching = true;
    Loans.getNewLoans($scope.selectedSort).then(function(loans) {
      $scope.fetching = false;
    });
  };
}]);
