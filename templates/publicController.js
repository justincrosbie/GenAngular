window.angular.module('ngff.controllers.${model.name}s', [])
  .controller('${model.camelname}sController', ['$scope','$routeParams','$location','Global',${controller-params-list}'${model.camelname}s',
    function($scope, $routeParams, $location, Global, ${function-params-list} ${model.camelname}s) {
 
      $scope.global = Global;

${--repeat1:tab:tab:
      $scope.${tab.name}Selected = function(tmp${model.name}) {
        $scope.tmp${model.name} = tmp${model.name};
      }
--1}
      $scope.create = function () {

        if ( !this.${model.name} ) {
          this.${model.name} = $scope.tmp${model.name};
        }

        var ${model.name} = new ${model.camelname}s({ 
${--repeat2:field:field:
          ${field.name}: this.${model.name}.${field.name} ? this.${model.name}.${field.name-id} : null${end-comma}--2}
        });
 
        ${model.name}.$save(function (response) {
          $location.path("${model.name}s/" + response._id);
        });
      };
 
      $scope.update = function () {
        var ${model.name} = $scope.${model.name};
 
        ${model.name}.$update(function () {
          $location.path('${model.name}s/' + ${model.name}._id);
        });
      };
 
      $scope.find = function (query) {
        ${model.camelname}s.query(query, function (${model.name}s) {
          $scope.${model.name}s = ${model.name}s.data;
        });
      };
 
      $scope.currentPage = 1;
      $scope.totalItems = 100;
      $scope.maxSize = 5;
      $scope.sortOrder = 1;
      var searchFields = [${--repeat3:field:field[@search='true' and @type!='ref']:'${field.name}'${end-comma}--3}];
      var sortFields = [${--repeat4:field:field[@sort='true']:'${field.name}'${end-comma}--4}];

      $scope.sortField = sortFields[0];
      
      $scope.findPaged = function () {
        var term = $scope.query || '';
        var termArray = term.split(' ');
        
        var q2val = {};
        for ( var i=0; i<termArray.length; i++ ) {
        	if ( i <= searchFields.length ) {
        		q2val[searchFields[i]] = { regex : termArray[i], options: 'i' };
        	}
        }

  		${--repeat5:field:field[@type="ref"]:
        if ( $scope.${field.name}Search ) {
          	q2val.${field.name} = $scope.${field.name}Search._id;
        }--5}

        var query = {
            q2: q2val
            , //search term
            sort_field: $scope.sortField,
            sort_order: $scope.sortOrder,
            page_limit: 10, // page size
            page: $scope.currentPage // page number
        };

        ${model.camelname}s.query(query, function (${model.name}s) {
          $scope.${model.name}s = ${model.name}s.data;
          if ( $scope.currentPage == 1 ) {
            $scope.totalItems = ${model.name}s.count;
          }
        });
      };
 
      $scope.findOne = function () {
        ${model.camelname}s.get({ ${model.name}Id: $routeParams.${model.name}Id }, function (${model.name}) {
          $scope.${model.name} = ${model.name};
          ${--repeat6:field:field[@type='Date']:
          if ( $scope.${model.name} && $scope.${model.name}.${field.name} ) {
            $scope.${model.name}.${field.name} = new Date($scope.${model.name}.${field.name});
          }--6}
        });
      };
 
      $scope.remove = function (${model.name}) {
        ${model.camelname}s.get({ ${model.name}Id: ${model.name}._id }, function (d) {
          d.$remove();
        });
        for (var i in $scope.${model.name}s) {
          if ($scope.${model.name}s[i] == ${model.name}) {
            $scope.${model.name}s.splice(i, 1)
          }
        }
        $scope.totalItems--;
      };

      $scope.pageChanged = function(page) {
        $scope.currentPage = page;
        $scope.findPaged();
      };

      $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
      };

      $scope.sortClass = {};
      $scope.sortClass[searchFields[0]] = 'sortable sort-asc sort-desc';

      $scope.changeSort = function (sortField) {
        if ( $scope.sortField == sortField ) {
          $scope.sortOrder *= -1;
        } else {
          $scope.sortOrder = 1;
        }

        $scope.sortClass = {};
        $scope.sortClass[sortField] = $scope.sortOrder == -1 ? 'headerSortDown' : 'headerSortUp';

        $scope.sortField = sortField;
        $scope.findPaged();
      }

    }]);