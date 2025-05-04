angular
  .module("app")
  .controller(
    "myfiles",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2, $location) {
      document.title = "My Files | FinFile";
 
      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1;

      console.log($scope.userinfo);

      $scope.foldername = "";

      $scope.usershare =  -1;
      $scope.permission =  "";

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.myfiles");
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
      $scope.flfilter = function (flval) {
        console.log(flval);
        $scope.flval = flval;
      };

      //files
      $scope.file_list = function () {
        $rest.get(`file_list?categoryid=${0}`).then(
          function success(res) {
            $scope.fileobj = res.data.map(function (files) {
              files.last_modified = new Date(
                files.last_modified.replace(" ", "T")
              );
              return files;
            });
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.file_list();
      $scope.file_upload = function () {};
      $scope.add_file = function (foldername) {
        if (foldername) {
          let fnobj = {
            foldername: foldername,
            userid: $scope.userinfo.user_id,
          };
          $rest.post("new_folder", fnobj).then(
            function success(res) {
              if (res.data.folder_id) {
                saberToast.success({
                  title: "Folder Created",
                  text: "New folder has been added successfully",
                  delay: 200,
                  duration: 1500,
                  rtl: false,
                  position: "top-right",
                });
                $state.reload();
              } else {
                saberToast.error({
                  title: "Folder Already Exists",
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
            title: "Folder Name Required",
            text: "Please enter a name before creating a new folder",
            delay: 200,
            duration: 1500,
            rtl: false,
            position: "top-right",
          });
          $state.reload();
        }
      };
      $scope.remove_file = function () {};
      $scope.share_file = function () {};  
      //folders
      $scope.folder_list = function () {
        $rest.get(`folder_list`).then(
          function success(res) {
            $scope.folderobj = res.data.map(function (files) {
              files.last_modified = new Date(
                files.last_modified.replace(" ", "T")
              );
              return files;
            });
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.folder_list();
      $scope.open_folder = function (files) {  
        localStorage.setItem('folderfiles', JSON.stringify(files));
        $state.go("app.folder_files");
      };
      $scope.download_folder = function (files) {
        let fnobj = {
          categoryid: files.category_id,
          name: files.category_name,
          path: files.category_path,
          userid: $scope.userinfo.user_id,
        }; 
        $rest.post("download_folder", fnobj).then(
          function success(res) { 
           if (res.data) {
              window.open(res.data.ZipNamePath, '_blank');
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
      $scope.share_folder = function(file, perm, sharefolderobj){ 
       
        let changeNum = file.map(item => item.replace('number:', ''));
        let fnobj = { 
            sharedid: changeNum,
            userid: $scope.userinfo.user_id,
            categoryid: sharefolderobj.category_id,
            permssn: perm,
        }  
        $rest.post("share_folder", fnobj).then(
          function success(res) { 
            saberToast.success({
              title: "Shared Folder",
              text: "Shared folder has been successfully",
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
      };
      $scope.remove_folder = function(file){
        SweetAlert2.fire({
          title: "Continue to Remove?",
          text: "Your about to remove this folder!",
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
                userid: $scope.userinfo.user_id,
            } 
            $rest.post("remove_folder", fnobj).then(
              function success(res) {
                saberToast.success({
                  title: "Remove Folder",
                  text: "Remove folder has been successfully",
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

      $scope.folder_upload = function (files) {
        var formData = new FormData();
        angular.forEach(files, function (file) {
          formData.append("files[]", file, file.name);
        });
        formData.append("user_id", $scope.userinfo.user_id);
        $http
          .post("api/upload_file", formData, {
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined },
          })
          .then(function (response) {
            console.log("Upload success:", response);
          })
          .catch(function (error) {
            console.error("Upload error:", error);
          });
      };

      $scope.triggerFolderInput = function () {
        document.getElementById("filesInput").click();
      };

      $scope.folder_modal = function (val) {
        $scope.modaltitle = val == 0 ? "Rename Folder" : "New Folder";
        $scope.modaltrigbtn = val == 0 ? "Update" : "Create";
        $scope.modalval = val;
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/nf-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
      };
      $scope.share_modal = function(file){
        console.log(file);
        $scope.sharefolderobj = file; 
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/share-folder-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
      }

      $scope.user_list = function(){
        $rest.get(`user_list`).then(
          function success(res) {
            $scope.userobj = res.data;
          },
          function error(err) {
            console.error(err); 
          }
        );
      }
      $scope.user_list(); 

      $scope.formatSize = function (bytes) {
        if (bytes === 0 || bytes == null) return "0 Bytes";

        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

        return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
      };
    }
  );
