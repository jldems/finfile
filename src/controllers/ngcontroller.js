app.controller(
  "ngController",
  function (
    $scope,
    Idle,
    Keepalive,
    $uibModal,
    SweetAlert2,
    $decrypt,
    $state,
    $rest
  ) {
    $scope.logout_user = function () {
      SweetAlert2.fire({
        title: "Continue to logout?",
        text: "Your about to logout from the system!",
        icon: "question",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#ff6913",
        cancelButtonColor: "#383838",
        cancelButtonClass: "text-white",
        confirmButtonText: "Continue",
        position: "center",
        iconColor: "#ff6913",
      }).then((result) => {
        if (result.value) {
          localStorage.clear();
          $state.go("login");
        }
      });
    };
    $scope.countdown = Idle.getTimeout();
    $scope.user_info = function () {
      let descrypted_o = $decrypt.decrypted(localStorage.getItem("ff_user"));
      let ff_user = JSON.parse(descrypted_o);

      $scope.info = {
        userid: ff_user.user_id,
        fullname: ff_user.full_name,
        role: ff_user.role,
        status: ff_user.status,
        avatar: ff_user.avatar_url,
        email: ff_user.email,
      };
    };
    $scope.user_info();

    // idle functions
    $scope.$on("IdleStart", function () {
      // $scope.modal_idle();
      console.log("Idle system started...");
    });

    $scope.$on("IdleTimeout", function () {
      // $scope.closeModal();
      localStorage.clear();
      location.reload(true);
      Idle.unwatch();
    });

    $scope.start = function () {
      Idle.watch();
    };
    $scope.start();

    $scope.modal_idle = function () {
      var $uibModalInstance = $uibModal.open({
        animation: true,
        templateUrl: "src/templates/modals/logout-modal.tpl.php",
        backdrop: "static",
        scope: $scope,
        size: "sm",
      });
      $scope.closeModal = function () {
        $uibModalInstance.close();
      };
    };
    $scope.toggleMenu = function () {
      console.log("asd");
      jQuery("#sidebar").toggleClass("sidebar-collapse");
      jQuery("#content").toggleClass("content-collapse");
    };
    $scope.goto = function (url) {
      $state.go(url);
    };
  }
);
