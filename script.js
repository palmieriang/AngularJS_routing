var app = angular.module("Demo", ["ngRoute"])
				 .config(function($routeProvider, $locationProvider) {
				 	$routeProvider.caseInsensitiveMatch = true;
				 	$routeProvider
				 		.when("/home", {
				 			templateUrl: "templates/home.html",
				 			controller: "homeController"
				 		})
				 		.when("/courses", {
				 			templateUrl: "templates/courses.html",
				 			controller: "coursesController"
				 		})
				 		.when("/students", {
				 			templateUrl: "templates/students.html",
				 			controller: "studentsController",
				 			resolve: {
				 				studentsList: function($http) {
								 	return $http.get("http://localhost/exercises/angular.1.RoutingAPI/api.php?func=getStud")
								 			.then(function(response) {
												return response.data;
							 				})
				 				}
				 			}
				 		})
				 		.when("/students/:ID", {
				 			templateUrl: "templates/studentDetails.html",
				 			controller: "studentDetailsController"
				 		})
				 		.when("/studentsSearch/:name?", {
				 			templateUrl: "templates/studentsSearch.html",
				 			controller: "studentsSearchController"
				 		})
				 		.when("/login", {
				 			templateUrl: "templates/login.html",
				 			controller: "loginController"
				 		})
				 		.when('/profile', {
				 			resolve: {
				 				'check': function($location, user){
				 					if(!user.isUserLoggedIn()) {
				 						$location.path('home');
				 					}
				 				}
				 			},
				 			templateUrl: "templates/profile.html"
				 		})
				 		.when("/test", {
				 			template: "<h1>Inline template in action</h1>",
				 			controller: "homeController"
				 		})
				 		.otherwise({
				 			redirectTo: "/home"
				 		})
			 		$locationProvider.html5Mode(true);
				 })
				.service('user', function() {
					var username;
					var loggedin = false;
					var id;

					this.setName = function(name) {
						username = name;
					};
					this.getName = function() {
						return username;
					};
					this.setID = function(userID) {
						id = userID;
					};
					this.getID = function() {
						return id;
					};
					this.userLoggedIn = function() {
						loggedin = true;
					};
					this.isUserLoggedIn = function() {
						return loggedin;
					};
				})
				 .controller("homeController", function($scope) {
				 	$scope.message = "Home Page";
				 })
				 .controller("coursesController", function($scope) {
				 	$scope.courses = ["C#", "VB.NET", "SQL Server", "ASP.NET"];
				 })
				 .controller("studentsController", function(studentsList, $scope, $http, $route, $rootScope, $log, $routeParams, $location) {
				 	// Using $routeChangeStart
				 	// $scope.$on("$routeChangeStart", function(event, next, current) {
				 	// 	if(!confirm("Are you sure you want to navigate away from this page to " + next.$$route.originalPath)) {
				 	// 		event.preventDefault();
				 	// 	};
				 	// });
				 	// Using $locationChangeStart
				 	// $scope.$on("$locationChangeStart", function(event, next, current) {
				 	// 	if(!confirm("Are you sure you want to navigate away from this page to " + next)) {
				 	// 		event.preventDefault();
				 	// 	};
				 	// });
					// $scope.$on("$locationChangeStart", function (event, next, current) {
					// 	$log.debug("$locationChangeStart fired");
					// 	$log.debug(event);
					// 	$log.debug(next);
					// 	$log.debug(current);
					// });

					// $scope.$on("$routeChangeStart", function (event, next, current) {
					// 	$log.debug("$routeChangeStart fired");
					// 	$log.debug(event);
					// 	$log.debug(next);
					// 	$log.debug(current);
					// });

				 	// var vm = this;

					$rootScope.$on("$locationChangeStart", function () {
				        $log.debug("$locationChangeStart fired");
				    });

				    $rootScope.$on("$routeChangeStart", function () {
				        $log.debug("$routeChangeStart fired");
				    });

				    $rootScope.$on("$locationChangeSuccess", function () {
				        $log.debug("$locationChangeSuccess fired");
				    });

				    $rootScope.$on("$routeChangeSuccess", function () {
				        $log.debug("$routeChangeSuccess fired");
				    });

				 	$scope.reloadData = function() {
				 		$route.reload();
				 	}

				 	// adding the query in the routeProvider, we don't need it anymore here but we have to inject the property name (studentsList) in this controller end we can remove $http
				 	// $http.get("http://localhost/exercises/angular.1.Routing/lesson25.php")
				 	// 	 .then(function(response) {
						// 	$scope.students = response.data;
				 	// 	 })

				 	$scope.students = studentsList;

				 	$scope.searchStudent = function(name) {
				 		if($scope.name) {
				 			$location.url("/studentsSearch/" + $scope.name);
				 		} else {
				 			$location.url("/studentsSearch");
				 		}
				 		$http.get("http://localhost/exercises/angular.1.RoutingAPI/api.php?func=letters&name="+$routeParams.name)
				 		 .then(function(response) {
							$scope.students = response.data;
				 		 })
				 	}
				 })
	            .controller("studentDetailsController", function ($scope, $http, $routeParams) {
	            	console.log($routeParams.ID);
	            	$http.get("http://localhost/exercises/angular.1.RoutingAPI/api.php?func=id&ID="+$routeParams.ID)
				 		 .then(function(response) {
	                	console.log(response);
							$scope.student = response.data[0];
				 		 })
	            })
				.controller("studentsSearchController", function ($scope, $http, $routeParams) {
				    if ($routeParams.name) {
				        $http({
				            url: "http://localhost/exercises/angular.1.RoutingAPI/api.php",
				            method: "get",
				            params: {
				            	func: 'letters',
				            	name: $routeParams.name
				            }
				        }).then(function (response) {
				        	console.log(response.data);
				            $scope.students = response.data;
				        })
				    } else {
				        $http.get("http://localhost/exercises/angular.1.RoutingAPI/api.php?func=getStud")
								.then(function (response) {
								    $scope.students = response.data;
						        	console.log($scope.students);
								})
				    }
				})
				.controller("loginController", function($scope, $http, $location, user) {
					$scope.login = function() {

						var username = $scope.username;
						var password = $scope.password;

						$http({
							url: 'http://localhost/exercises/angular.1.RoutingAPI/api.php',
							method: 'POST',
							headers: {
								'Content-Type' : 'application/x-www-form-urlencoded'
							},
							data: 'username='+username+'&password='+password+'&func=login'
						}).then(function(response) {
							console.log(response.data);
							if(response.data.status == 'loggedin') {
								user.userLoggedIn();
								user.setName(response.data.user);
								$location.path('/profile');
							} else {
								alert('Error! Invalid login.')
							}
						})

					}
				})
				.controller("profileController", function($scope, user) {
					$scope.user = user.getName();
				})
