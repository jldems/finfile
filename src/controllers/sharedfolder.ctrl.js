angular
  .module("app")
  .controller(
    "sharedfolder",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2) {
      document.title = "Shared Folder | FinFile";
 
      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1; 

      $scope.foldername = "";

      $scope.usershare =  -1;
      $scope.permission =  "";

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.sharedfolder");
        } else {
          $state.go("login");
        }
      };
      $scope.check_loggedIn();

      $scope.dateOptions = [
        { label: "Today" },
        { label: "Last 7 days" },
        { label: "Last 30 days" },
        { label: "This year (2025)" },
        { label: "Last year (2024)" },
      ];
       $scope.flfilter = function (val) { 
        if(val){
          $scope.flval = val.full_name;
          $scope.filuserid = val.user_id;
          $scope.sharedfolder_list($scope.userinfo.user_id);
        }else{
          $scope.flval = false;
        }
      };
      $scope.setModified = function (val) {
        $scope.modifiedVal = val;
        $scope.sharedfolder_list($scope.userinfo.user_id);
      };
  
      $scope.sharedfolder_list = function (userid) {
        $rest.get(`sharedfolder_list?userid=${userid}`).then(
          function success(res) { 
            if (res.data) {
              let files = res.data.map(function (file) {
                file.shared_at = new Date(file.shared_at.replace(" ", "T"));
                return file;
              });
              // Apply Type filter
 
              if ($scope.filuserid) { 
                files = files.filter(file => file.shared_by === $scope.filuserid);
              }

              // Apply Modified filter
              if ($scope.modifiedVal) {
                const now = new Date();
                files = files.filter(file => {
                  const modified = file.shared_at;

                  switch ($scope.modifiedVal) {
                    case "Today":
                      return modified.toDateString() === now.toDateString();

                    case "Last 7 days":
                      return modified >= new Date(now.setDate(now.getDate() - 7));

                    case "Last 30 days":
                      return modified >= new Date(now.setDate(now.getDate() - 30));

                    case "This year (2025)":
                      return modified.getFullYear() === 2025;

                    case "Last year (2024)":
                      return modified.getFullYear() === 2024;

                    default:
                      return true;
                  }
                });
              }

              $scope.shfolderobj = files;
            } else {
              $scope.shfolderobj = [];
            }
          },
          function error(err) {
            console.error(err);
            $scope.shfolderobj = [];
          }
        );
      };
      $scope.sharedfolder_list($scope.userinfo.user_id);

      $scope.open_folder = function (files) {   
        localStorage.setItem('folderfiles', JSON.stringify(files));
        $state.go("app.folder_files");
      };
      $scope.download_folder = function (files) {
        let fnobj = {
          categoryid: files.category_id,
          name: files.category_name,
          path: files.category_path,
          userid: files.shared_by,
        };  
        $rest.post("download_folder", fnobj).then(
          function success(res) { 
           if (res.data) {
              window.open(res.data.urlLink, '_blank');
              $scope.unlink_zip(res.data.pathLink);
              saberToast.success({
                title: "Download Folder",
                text: "Download folder has been successfully",
                delay: 200,
                duration: 1500,
                rtl: false,
                position: "top-right",
              });
            }else{
               saberToast.error({
                title: "Failed Download Folder",
                text: "No files found in the folder",
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
      };
      $scope.rename_folder = function (fileid, type) {
        if (fileid > 0) {
          $rest.get(`rename_folder?fileid=${fileid}&type=${type}`).then(
            function success(res) { 
              $scope.foldername = res.data.category_name;
              $scope.folderlist = {
                categoryname: res.data.category_name,
                categoryid: res.data.category_id,
                categorypath: res.data.category_path,
              };
              $scope.folder_modal(0);
            },
            function error(err) {
              console.error(err);
            }
          );
        } else {
          $scope.foldername = "";
          $scope.folderlist = {
            categoryname: "",
            categoryid: 0,
            categorypath: "",
          };
        }
      };
      $scope.update_folder = function (foldername, folderlist) {
        if (foldername != folderlist.categoryname) {
          let fnobj = {
            categoryid: folderlist.categoryid,
            categoryname: folderlist.categoryname,
            foldername: foldername,
            userid: $scope.userinfo.user_id,
          };
          $rest.post("update_folder", fnobj).then(
            function success(res) {
              saberToast.success({
                title: "Folder Renamed",
                text: "Renamed folder has been successfully",
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
        } else {
          saberToast.error({
            title: "Folder Name Required",
            text: "Please enter a name before renaming a folder",
            delay: 200,
            duration: 1500,
            rtl: false,
            position: "top-right",
          });
          $state.reload();
        }
      };
      $scope.remove_sharedfolder = function(file){
        SweetAlert2.fire({
          title: "Continue to Remove?",
          text: "Your about to remove this shared folder!",
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
            let fnobj = {
                categoryid: file.category_id, 
                ushareid: file.shared_by, 
                categname: file.category_name, 
                userid: $scope.userinfo.user_id,
                username: $scope.userinfo.full_name,
            }   
            $rest.post("sharedfolder_remove", fnobj).then(
              function success(res) {
                saberToast.success({
                  title: "Remove Shared Folder",
                  text: "Remove shared folder has been successfully",
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

      $scope.unlink_zip = function(url){
        let fnobj = {
          urls: url,
        };   
        $rest.post("unlink_zip", fnobj).then(
          function success(res) {
            console.log(res);  
          },
          function error(err) {
            console.error(err);
          }
        );
      }
    }
  );
