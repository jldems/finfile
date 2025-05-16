angular.module("app").controller("lognotif", function ($scope, $state, $rest, $http, $decrypt, SweetAlert2) {
  document.title = "Profile | FinFile";

  let ff_user = localStorage.getItem("ff_user");
  let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
  $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
  $scope.logsobj  = {}; 
  $scope.items_per_page = 50;
  $scope.current_page = 1;  

  $scope.logs_list = function(userid){
    $rest.get(`falogs_list?userid=${userid}&moduleval=${1}`).then(
      function success(res) { 
        if(res.data){
          let files = res.data.map(function (file) {
            file.logsdate = new Date(file.logsdate.replace(" ", "T"));
            return file;
          });
          $scope.logsobj = files; 
        }else{
          $scope.logsobj = [];
        }
      },
      function error(err) {
        $scope.logsobj  = {};
        console.error(err); 
      }
    );
  }
  $scope.logs_list($scope.userinfo.user_id);

  $scope.ntfctns_list = function(userid){
    $rest.get(`ntfctns_list?userid=${userid}&moduleval=${1}`).then(
      function success(res){
        console.log(res.data);
        if(res.data){
          let files = res.data.map(function (file) {
            file.created_at = new Date(file.created_at.replace(" ", "T"));
            return file;
          });
          $scope.notifobj = files;
        }else{
          $scope.notifobj = []; 
        }
        
      }, 
      function error(err){
        console.log(err);
        $scope.notifobj = [];
      })
  }
  $scope.ntfctns_list($scope.userinfo.user_id);

  $scope.check_loggedIn = function () {
    let ff_user = localStorage.getItem("ff_user");
    if (ff_user) {
      $state.go("app.lognotif");
    } else {
      $state.go("login");
    }
  };
  $scope.check_loggedIn();
});
