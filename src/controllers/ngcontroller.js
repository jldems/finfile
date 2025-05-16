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
    let ff_user = localStorage.getItem("ff_user");
    let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
    $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
  
    $scope.usagePercent = 0;
    $scope.teamfoldername = "";
    $scope.teammember =  -1; 
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

    $scope.user_info = function (ff_user) { 
      if(ff_user){
        $scope.info = {
          userid: ff_user.user_id,
          fullname: ff_user.full_name,
          role: ff_user.role,
          status: ff_user.status,
          avatar: ff_user.avatar_url,
          email: ff_user.email,
        };
      }else{
        $state.go("login");
      }
    };
    $scope.user_info($scope.userinfo);

    // idle functions
    $scope.$on("IdleStart", function () { 
      console.log("Idle system started...");
    });

    $scope.$on("IdleTimeout", function () { 
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

    $scope.disk_usage = function(){
      $rest.get(`disk_usage`).then(
        function success(res) {  
          let data = res.data;
          let total = data.TotalSpace;
          let used = data.UsedSpace;
          $scope.usagePercent = Math.round((used / total) * 100); 
        },
        function error(err) {
          console.error(err); 
        }
      );
    }
    $scope.disk_usage();


    /* recent calculating total */
    $scope.recent_list = function (userid) {  
      $rest.get(`recent_list?userid=${userid}`).then(
        function success(res) {   
          $scope.recentobj = res.data;
          $scope.merge_recent_lists();
        },
        function error(err) {
          console.error(err);
          $scope.folderobj = [];
        }
      );
    };
    $scope.recent_list($scope.userinfo.user_id);

    $scope.shared_recent_list = function (userid) { 
      $rest.get(`shared_recent_list?userid=${userid}`).then(
        function success(res) { 
          $scope.sharedrecentobj = res.data;
          $scope.merge_recent_lists();
        },
        function error(err) {
          console.error(err);
          $scope.folderobj = [];
        }
      );
    };
    $scope.shared_recent_list($scope.userinfo.user_id);
    $scope.merge_recent_lists = function () {
      let today = new Date();
      let todayDateString = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

      let allRecentItems = [...($scope.recentobj || []), ...($scope.sharedrecentobj || [])];

      

      let todaysUploads = allRecentItems.filter(item => {
        if (!item.uploaded_at) return false;

        // Convert timestamp to date (check if it's in seconds and convert if needed)
        let uploadDate = new Date(item.uploaded_at);
        if (uploadDate.getFullYear() < 2000) {
          // Likely a timestamp in seconds, convert to milliseconds
          uploadDate = new Date(item.uploaded_at * 1000);
        }

        let uploadDateString = uploadDate.toISOString().slice(0, 10);
        return uploadDateString === todayDateString;
      });

      $scope.todayUploadCount = todaysUploads.length;

      
    }; 

    $scope.falogs_list = function(userid){
      $rest.get(`falogs_list?userid=${userid}&moduleval=${0}`).then(
        function success(res){
          if(res.data){
            let files = res.data.map(function (file) {
              file.logsdate = new Date(file.logsdate.replace(" ", "T"));
              return file;
            });
            $scope.falobj = files; 
          }else{
            $scope.falobj = [];
          }
          
        }, 
        function error(err){
          console.log(err);
          $scope.falobj = [];
        })
    }
    $scope.falogs_list($scope.userinfo.user_id);

    $scope.ntfctns_list = function(userid){
      $rest.get(`ntfctns_list?userid=${userid}&moduleval=${0}`).then(
        function success(res){
          if(res.data){
            let files = res.data.map(function (file) {
              file.created_at = new Date(file.created_at.replace(" ", "T"));
              return file;
            });
            $scope.ntfsobj = files; 
  
            let today = new Date();
            let todayNotifs = files.filter(n => {
              let notifDate = new Date(n.created_at);
              return notifDate.toDateString() === today.toDateString();
            });
      
            $scope.todayNotificationsCount = todayNotifs.length;
  
            todayNotifs.forEach(function(notification) {
              if(notification.is_read == 0){
                $scope.showToast(notification); 
              }
              
            });
          }else{
            $scope.ntfsobj = []; 
          }
          
        }, 
        function error(err){
          console.log(err);
          $scope.ntfsobj = [];
          $scope.todayNotificationsCount = 0;
        })
    }
    $scope.ntfctns_list($scope.userinfo.user_id);

    $scope.mark_as_read = function(ntfsobj){
      let notifobj = {
        ntfsobj: ntfsobj, 
        userid: $scope.userinfo.user_id,
      };  
      $rest.post("mark_as_read", notifobj).then(
        function success(res) {
          $scope.ntfctns_list($scope.userinfo.user_id); 
        },
        function error(err) {
          console.error(err);
        }
      );
    }

    $scope.showToast = function(notification) { 
      const toastHtml = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
          <div class="toast-header">
            <strong class="me-auto text-dark">${notification.title}</strong>
            <small class="text-dark">${new Date(notification.created_at).toLocaleTimeString()}</small>
            <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body text-dark">${notification.messages}</div>
        </div>
      `;
    
      // Append to toast container
      const container = document.getElementById("toast-container");
      container.insertAdjacentHTML("beforeend", toastHtml);
    
      // Show the toast
      const toastElements = container.querySelectorAll(".toast");
      const newToast = toastElements[toastElements.length - 1];
      const toast = new bootstrap.Toast(newToast);
      toast.show();
    
      // Optional: Remove from DOM after hidden
      newToast.addEventListener("hidden.bs.toast", function () {
        newToast.remove();
      });
    };

    /* favorite calculating total */

    $scope.getFavorites = function (userid) {
      const endpoints = {
        fsobj: `files_favorite?userid=${userid}`,
        sffsobj: `sf_favorites?userid=${userid}`,
        flobj: `folder_favorite?userid=${userid}`
      };

      // Clear existing
      $scope.fsobj = [];
      $scope.sffsobj = [];
      $scope.flobj = [];

      let promises = Object.entries(endpoints).map(([key, url]) =>
        $rest.get(url)
          .then(res => $scope[key] = res.data)
          .catch(err => {
            console.error(err);
            $scope[key] = [];
          })
      );

      Promise.all(promises).then(() => $scope.mergeFavoritesToday());
    };
    $scope.getFavorites($scope.userinfo.user_id);
    // Merge and count today's favorites
    $scope.mergeFavoritesToday = function () {
      const todayDate = new Date().toISOString().slice(0, 10);

      let allFavorites = [
        ...($scope.fsobj || []),
        ...($scope.flobj || []),
        ...($scope.sffsobj || [])
      ];

      $scope.todayFavCount = allFavorites.filter(item => {
        if (!item.last_modified) return false;

        let timestamp = isNaN(item.last_modified)
          ? new Date(item.last_modified)
          : new Date(item.last_modified * 1000);

        return timestamp.toISOString().slice(0, 10) === todayDate;
      }).length;
    }; 

    /*add team storage*/
    $scope.team_list = function(userid){
      $rest.get(`team_list?userid=${userid}`).then(
        function success(res) {   
          if(res.data){
            $scope.teamobj = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
          }else{
            $scope.teamobj = [];
          }
        
        },
        function error(err) {
          console.error(err);
          $scope.teamobj = [];
        }
      );
    }
    $scope.team_list($scope.userinfo.user_id);
    $scope.team_open = function(teams){ 
      localStorage.setItem('teamfolder', JSON.stringify(teams));
      $state.go("app.teamfolder", {}, {reload: true});
    }
    $scope.create_teamfolder = function (teamfoldername, teamember) { 
        if (teamfoldername && teamember != -1) {
          let changeNum = teamember.map(item => item.replace('number:', ''));
          let fnobj = {
            teamemberid: changeNum,
            foldername: teamfoldername,
            userid: $scope.userinfo.user_id,
            username: $scope.userinfo.full_name,
          }; 
          $rest.post("create_teamfolder", fnobj).then(
            function success(res) {
              if (res.data.folder_id) {
                saberToast.success({
                  title: "Team Folder Created",
                  text: "New team folder has been added successfully",
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
                });
                $state.reload();
              } else {
                saberToast.error({
                  title: "Team Folder Already Exists",
                  text: "A folder with this name already exists for the user.",
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
                });
                $state.reload();
              }
            },
            function error(err) {
              console.error(err);
            }
          );
        } else {
          saberToast.error({
            title: "Name & Members are Required",
            text: "Please enter a name & member before creating a new team folder",
            delay: 200,
            duration: 1500,
            rtl: false,
            position: "top-right",
          });
          $state.reload();
        }
    };
    $scope.team_modal = function (val) {
        $scope.modaltitle = val == 0 ? "Rename Team Folder" : "New Team Folder";
        $scope.modaltrigbtn = val == 0 ? "Update" : "Create";
        $scope.modalval = val;
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/tm-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
    };

    $scope.user_list = function(){
      $rest.get(`user_list`).then(
        function success(res) {
          $scope.userobj = res.data.filter(user => user.user_id !== $scope.userinfo.user_id);
        },
        function error(err) {
          console.error(err); 
        }
      );
    }
    $scope.user_list(); 
  }
);
