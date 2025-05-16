angular.module("app").controller("login", function ($scope, $state, $rest) {
  document.title = "LOGIN | FinFile";
  $scope.users = {
    username: "",
    password: "",
  };
  $scope.msg = "";
  $scope.login_user = function (users) {
    if (users.username == "" || users.password == "") {
      $scope.msg = "Invalid username or password!";
    } else {
      let userObj = {
        username: users.username,
        password: users.password,
      };
      $rest.post("login_user", userObj).then(
        function success(res) {
          if (res.data) {
            $state.go("app.overview");
            var encryptedUser = CryptoJS.AES.encrypt(
              JSON.stringify(res.data),
              "Passphrase"
            );
            localStorage.setItem("ff_user", encryptedUser);
          } else {
            $scope.msg = "Wrong username or password!";
          }
          $scope.msg = "";
        },
        function error(err) {
          $scope.msg = err.data.msg;
          console.error(err);
        }
      );
    }
  };

  $scope.check_loggedIn = function () {
    let ff_user = localStorage.getItem("ff_user");
    if (ff_user) {
      $state.go("overview");
    } else {
      $state.go("login");
    }
  };
  $scope.check_loggedIn();

  $scope.goto = function (url) {
    $state.go(url);
  };
});
