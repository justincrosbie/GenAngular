window.angular.module('ngff.controllers.index', [])
  .controller('IndexController', ['$scope', 'Global',
    function($scope, Global) {
      $scope.global = Global;

	  $scope.myInterval = 5000;
    }]);