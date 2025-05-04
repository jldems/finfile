var app = angular.module("app", [
  "ui.router",
  "oc.lazyLoad",
  "ngAnimate",
  "ngSanitize",
  "ngIdle",
  "angular.filter",
  "recepuncu.ngSweetAlert2",
  "ui.bootstrap",
  "monospaced.qrcode",
]);

app.config(function (
  $stateProvider,
  $urlRouterProvider,
  IdleProvider,
  KeepaliveProvider,
  $locationProvider,
  $ocLazyLoadProvider
) {
  $locationProvider.hashPrefix("");
  IdleProvider.idle(5000);
  IdleProvider.timeout(20);
  KeepaliveProvider.interval(5000);
  $urlRouterProvider.otherwise("/overview");
  $urlRouterProvider.when("/myfiles", "/myfiles/folders");

  $ocLazyLoadProvider.config({
    debug: true,
    events: true,
  });

  $stateProvider.state("app", {
    abstract: true,
    templateUrl: "src/templates/includes/main.tpl.php",
  });
  // authentication
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: "src/templates/auth/login.tpl.php",
    controller: "login",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/login.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.overview", {
    url: "/overview",
    templateUrl: "src/templates/overview.tpl.php",
    controller: "overview",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/overview.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.myfiles", {
    url: "/myfiles",
    templateUrl: "src/templates/myfiles/myfiles.php",
    controller: "myfiles",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/myfiles.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.myfiles.folders", {
    url: "/folders", 
    templateUrl: "src/templates/myfiles/folders.php", 
  });
  $stateProvider.state("app.myfiles.files", {
    url: "/files", 
    templateUrl: "src/templates/myfiles/files.php",  
  });
  $stateProvider.state("app.folder_files", {
    url: "/folder_files",
    templateUrl: "src/templates/folderfiles/folder_files.php",  
    controller: "folderfiles",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/folderfiles.ctrl.js"],
          });
        },
      ],
    },
  });
});
