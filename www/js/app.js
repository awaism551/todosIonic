// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.closePopup'])

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

    .controller('MyCtrl', function ($scope, localStorageService, $ionicTabsDelegate, $ionicPopup, $ionicModal, IonicClosePopupService, $ionicListDelegate) {

        $scope.data = {};
        $scope.shouldShowDelete = false;
        $scope.data.disableAll = false;

        $scope.getTodos = function () {
            $scope.todos = localStorageService.get('todos');
        };

        function getNextId() {
            var todos = localStorageService.get('todos') || [];
            var id = todos.length !== 0 ? todos[todos.length - 1].id : 0;
            return ++id;
        }

        $ionicModal.fromTemplateUrl('templates/update.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.editModal = modal;
        });

        $scope.openEditModal = function (id) {
            for (var i = 0; i < $scope.todos.length; i++) {
                if ($scope.todos[i].id === id) {
                    $scope.data.newtodo = $scope.todos[i].value;
                    $scope.data.toUpdateId = $scope.todos[i].id;
                }
            }
            $scope.editModal.show();
        };

        $scope.closeEditModal = function () {
            $scope.editModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.editModal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            console.log('modal hidden');
            $scope.data.newtodo = "";
            $ionicListDelegate.closeOptionButtons();
        });

        $scope.editTodo = function () {
            var id = $scope.data.toUpdateId;
            for (var i = 0; i < $scope.todos.length; i++) {
                if ($scope.todos[i].id === id) {
                    $scope.todos[i].value = $scope.data.newtodo;
                }
            }
            localStorageService.set('todos', $scope.todos);
            $scope.closeEditModal();
        }

        $scope.setTodo = function () {
            if ($scope.data.newtodo) {
                var todos = localStorageService.get('todos') || [];
                var id = getNextId();
                var obj = {
                    id: id,
                    value: $scope.data.newtodo
                }
                todos.push(obj);
                $scope.data.newtodo = "";
                localStorageService.set('todos', todos);
                // $ionicTabsDelegate.select(0);
                $scope.getTodos();
            }
        };

        $scope.confirmDelete = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Todo',
                template: 'Are you sure to delete this todo?'
            });
            IonicClosePopupService.register(confirmPopup);
            return confirmPopup.then(function (res) {
                return res;
            });
        };

        $scope.deleteTodo = function (id) {
            console.log('del fun');
            if (!$scope.data.disableAll) {
                $scope.data.disableAll = true;
                $scope.confirmDelete().then(function (res) {
                    if (res) {
                        $scope.todos = $scope.todos.filter((item) => item.id !== id);
                        localStorageService.set('todos', $scope.todos);
                    }
                    $scope.data.disableAll = false;
                }, function (err) {
                    console.log(err);
                });
            }
        }
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
