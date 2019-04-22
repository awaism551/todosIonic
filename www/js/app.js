// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs).
            // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
            // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
            // useful especially with forms, though we would prefer giving the user a little more room
            // to interact with the app.
            if (window.cordova && window.Keyboard) {
                window.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();
            }
        });
    })

    .config(['$ionicConfigProvider', function ($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');

    }])

    .controller('MyCtrl', function ($scope, localStorageService, $ionicTabsDelegate) {

        $scope.data = {};

        $scope.getTodos = function () {
            $scope.todos = localStorageService.get('todos');
        };



        $scope.setTodo = function () {
            if ($scope.data.newtodo) {
                var todos = localStorageService.get('todos');
                if (!todos) {
                    todos = {};
                }
                todos['3'] = $scope.data.newtodo;
                $scope.data.newtodo = "";
                localStorageService.set('todos', todos);
                $ionicTabsDelegate.select(0);
                $scope.getTodos();
            }
        };
    })

    .factory('localStorageService', [function () {
        return {
            set: function (key, value) {
                return localStorage.setItem(key, JSON.stringify(value));
            },
            get: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            destroy: function (key) {
                return localStorage.removeItem(key);
            },
        };
    }])
