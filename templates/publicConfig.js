//Setting up route
window.app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', 
  { 
    templateUrl: 'views/index.html' 
  })

${--repeat1:model:model:  .when('/${model.name}s', 
  {
    templateUrl: 'views/${model.name}s/list.html', label: 'List ${model.title}'
  })
  .when('/${model.name}s/create', 
  { 
    templateUrl: 'views/${model.name}s/create.html', label: 'Create ${model.title}'
  })  
  .when('/${model.name}s/:${model.name}Id/edit', 
  { 
    templateUrl: 'views/${model.name}s/edit.html', label: 'Edit ${model.title}'
  })
  .when('/${model.name}s/:${model.name}Id', 
  { 
    templateUrl: 'views/${model.name}s/view.html', label: 'View ${model.title}' 
  })
  
--1}  
      .otherwise({redirectTo: '/'});
}]);

//Removing tomcat unspported headers
window.app.config(['$httpProvider', function($httpProvider, Configuration) {
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
}]);