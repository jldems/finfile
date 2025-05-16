angular.module("app").controller("create_account", function ($scope, $state, $rest, $http) {
  document.title = "Create Account | FinFile";
  $scope.users = {
    username: "",
    password: "",
  };
  $scope.msg = "";

  let lsaccount = JSON.parse(localStorage.getItem("createaccount"));
  let lsca = lsaccount ? lsaccount : {};

  $scope.ca = {
    fullname: lsca.fullname || "",
    email: lsca.email || "",
    username: lsca.username || "",
    password: lsca.password || "",
    avatar: "src/assets/images/profile-picture.png",
  }

  $scope.create_onchange = function(ca){
    localStorage.setItem('createaccount', JSON.stringify(ca));
  }
  $scope.create_account = function(ca){
    var formData = new FormData();

    formData.append("fullname", ca.fullname);
    formData.append("email", ca.email);
    formData.append("username", ca.username);
    formData.append("password", ca.password);

    if ($scope.avatarFile) {
        formData.append("avatar", $scope.avatarFile);  // append file
    }

    $http.post("api/create_profile", formData, {
      transformRequest: angular.identity,
      headers: { "Content-Type": undefined },
    }).then(
        function success(res) {
          let status = res.data.success ? 'success' : 'error'; 
          if (status === 'success') {
              saberToast.success({
                  title: "Create Account",
                  text: res.data.message,
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
              });
              localStorage.removeItem("createaccount");
              $state.go('login'); 
          } else {
              saberToast.error({
                  title: "Create Account",
                  text: res.data.message,
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
              });
              localStorage.removeItem("createaccount");
          }
          
        },
        function error(err) {
            console.error(err);
        }
    );
  }

  $scope.avatar_change = function(input) {
      var file = input.files[0];

      if (!file) return;

      var allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
          saberToast.error({
              title: "Upload Error",
              text: "Only image files (JPG, PNG, GIF, WebP) are allowed",
              delay: 200,
              duration: 1500,
              rtl: false,
              position: "top-right",
          });
          return;
      }

      $scope.avatarFile = file;

      var reader = new FileReader();
      reader.onload = function(e) {
          $scope.$apply(function() {
              $scope.ca.avatar = e.target.result; 
          });
      };
      reader.readAsDataURL(file);
  };

  $scope.remove_img = function() {
      $scope.ca.avatar = "src/assets/images/profile-picture.png";
      $state.reload();
  };
});
