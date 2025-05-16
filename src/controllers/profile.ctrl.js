angular.module("app").controller("profile", function ($scope, $state, $rest, $http, $decrypt, SweetAlert2) {
  document.title = "Profile | FinFile";

  let ff_user = localStorage.getItem("ff_user");
  let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
  $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
  $scope.prfl = {}; 

  $scope.profile = function(userid){
    $rest.get(`profile?userid=${userid}`).then(
      function success(res) { 
        $scope.prfl = {
          userid: res.data.user_id,
          fullname: res.data.full_name,
          email: res.data.email,
          username: res.data.user_name,
          password: res.data.password_hash,
          createdat: res.data.created_at,
          avatar: res.data.avatar_url? res.data.avatar_url: "src/assets/images/profile-picture.png",
          confirmpassword: "",
          newpassword: "",
        } 
      },
      function error(err) {
        $scope.prfl = {};
        console.error(err); 
      }
    );
  }
  $scope.profile($scope.userinfo.user_id);

  $scope.remove_avatar = function(prfl) { 
    SweetAlert2.fire({
      title: "Continue to Remove?",
      text: "Your about to remove this avatar!",
      icon: "question",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#ff6913",
      cancelButtonColor: "#383838",
      cancelButtonClass: "text-white",
      confirmButtonText: "Remove",
      position: "center",
      iconColor: "#ff6913",
    }).then((result) => {
      if (result.value) {
        let userobj = { 
            userid: prfl.userid,
            path: prfl.avatar,
        }  
        $rest.post("remove_avatar", userobj).then(
          function success(res) {
            saberToast.success({
              title: "Remove Avatr",
              text: "Remove avatar has been successfully",
              delay: 200,
              duration: 1500,
              rtl: false,
              position: "top-right",
            });
            $state.reload();
          },
          function error(err) {
            console.error(err);
          }
        );
      }
    });
  };

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
            $scope.prfl.avatar = e.target.result; 
        });
    };
    reader.readAsDataURL(file);
  };

  $scope.update_profile = function(prfl){

    var formData = new FormData();

    formData.append("userid", prfl.userid);
    formData.append("fullname", prfl.fullname);
    formData.append("email", prfl.email);
    formData.append("username", prfl.username);
    formData.append("password", prfl.password);
    formData.append("confirmpassword", prfl.confirmpassword);
    formData.append("newpassword", prfl.newpassword);
    formData.append("oldavatar", prfl.avatar);

    if ($scope.avatarFile) {
        formData.append("avatar", $scope.avatarFile); 
    } 
    $http.post("api/update_profile", formData, {
      transformRequest: angular.identity,
      headers: { "Content-Type": undefined },
    }).then(
        function success(res) { 
          let status = res.data.success ? 'success' : 'error'; 
          if (status === 'success') {
              saberToast.success({
                  title: "Update Profile",
                  text: res.data.message,
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
              });
          } else {
              saberToast.error({
                  title: "Update Profile",
                  text: res.data.message,
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
              });
          }
          $state.reload();
        },
        function error(err) {
            console.error(err);
        }
    );
  }
  $scope.check_loggedIn = function () {
    let ff_user = localStorage.getItem("ff_user");
    if (ff_user) {
      $state.go("overview");
    } else {
      $state.go("login");
    }
  };
  $scope.check_loggedIn();
});
