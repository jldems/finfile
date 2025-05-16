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
  let myfilescurrentpath = JSON.parse(localStorage.getItem('myfilespath')) || "/myfiles/folders";
  $urlRouterProvider.when("/myfiles", myfilescurrentpath);

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
  $stateProvider.state("create_account", {
    url: "/create_account",
    templateUrl: "src/templates/auth/create_account.tpl.php",
    controller: "create_account",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/create_account.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.profile", {
    url: "/profile",
    templateUrl: "src/templates/auth/profile.tpl.php",
    controller: "profile",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/profile.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.lognotif", {
    url: "/lognotif",
    templateUrl: "src/templates/auth/lognotif.tpl.php",
    controller: "lognotif",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/lognotif.ctrl.js"],
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

  $stateProvider.state("app.favorites", {
    url: "/favorites",
    templateUrl: "src/templates/favorites/favorites.php",
    controller: "favorites",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/favorites.ctrl.js"],
          });
        },
      ],
    }
  })
  
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

  $stateProvider.state("app.recent_uploads", {
    url: "/recent_uploads",
    templateUrl: "src/templates/recentuploads/recent_uploads.php",  
    controller: "recentuploads",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/recentuploads.ctrl.js"],
          });
        },
      ],
    },
  });

  $stateProvider.state("app.trash", {
    url: "/trash",
    templateUrl: "src/templates/trash/trash.php",  
    controller: "trash",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/trash.ctrl.js"],
          });
        },
      ],
    },
  });

  $stateProvider.state("app.sharedfiles", {
    url: "/shared_files",
    templateUrl: "src/templates/sharedfiles/files.php",  
    controller: "sharedfiles",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/sharedfiles.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.sharedfolder", {
    url: "/shared_folder",
    templateUrl: "src/templates/sharedfolder/folder.php",  
    controller: "sharedfolder",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/sharedfolder.ctrl.js"],
          });
        },
      ],
    },
  });

  $stateProvider.state("app.teamfolder", {
    url: "/teamfolder_files",
    templateUrl: "src/templates/teamfolder/teamfolder.php",  
    controller: "teamfolder",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/teamfolder.ctrl.js"],
          });
        },
      ],
    },
  });
  $stateProvider.state("app.team", {
    url: "/team",
    templateUrl: "src/templates/teamfolder/team.php",  
    controller: "teamfolder",
    resolve: {
      loadController: [
        "$ocLazyLoad",
        function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: "app",
            files: ["src/controllers/teamfolder.ctrl.js"],
          });
        },
      ],
    },
  });
});
