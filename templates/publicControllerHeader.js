  window.angular.module('ngff.controllers.header', [])
  .controller('HeaderController', ['$scope', 'Global',
    function ($scope, Global) {
      $scope.global = Global;
 		$scope.currentAppName = Global.currentAppName();

      $scope.changeNavbar = function(link) {

        $scope.navbarEntries = $scope.apps[link].navbarEntries;
        $scope.navbarAdminEntries = $scope.apps[link].navbarAdminEntries;

      	Global.currentApp(link);
      	Global.introMessage($scope.apps[link].description);
 		$scope.currentAppName = Global.currentAppName();
      }
 

		$scope.apps = {

		  ${--repeat1:menu:menu:"${menu.name}":
		  {
		    "title": "${menu.title}",
		    "link": "${menu.link}",
		    "description": "${menu.description}",
		    "navbarEntries": 
		    [
		      ${--repeat2:menu-item:menu[@name='${menu.name}']/main-menu/menu-item:
			  {
			    "title": "${menu-item.title}",
			    "link": "${menu-item.link}"
			  }${end-comma}--2}
			],
			"navbarAdminEntries":
			[
		      ${--repeat3:menu-item:menu[@name='${menu.name}']/admin-menu/menu-item:
			  {
			    "title": "${menu-item.title}",
			    "link": "${menu-item.link}"
			  }${end-comma}--3}
			]
		  }${end-comma}--1}
		};
		
		var appsArray = [${--repeat4:menu:menu:'${menu.name}'${end-comma}--4}];

		$scope.navbarEntries = $scope.apps[appsArray[0]].navbarEntries;
		$scope.navbarAdminEntries = $scope.apps[appsArray[0]].navbarAdminEntries;

    }]);