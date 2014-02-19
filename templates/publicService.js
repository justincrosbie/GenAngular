window.angular.module('ngff.services.${model.name}s', [])
  .factory('${model.camelname}s', ['$resource', 
    function($resource){
      return $resource(
        '${model.name}s/:${model.name}Id', 
        {
          ${model.name}Id:'@_id'
        }, 
        { 
          query:  {method:'GET', isArray:false},
          update: {method: 'PUT'}
        }
      )
    }]);