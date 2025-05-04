angular
  .module("app")
  .controller(
    "folderfiles",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2, $location, $sce) {
      document.title = "Folder Files | FinFile";

      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1;

      console.log($scope.userinfo);

      let fl_files = localStorage.getItem("folderfiles");
      $scope.folderdata = fl_files? JSON.parse(fl_files) : ""; 

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.folder_files");
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

      $scope.file_list = function (categoryid) { 
        $rest.get(`file_list?categoryid=${categoryid}`).then(
          function success(res) { 
            $scope.ffileobj = res.data.map(function (files) {
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
      $scope.file_list($scope.folderdata.category_id);
      $scope.open_files = function (files) { 
        console.log(files);
        $scope.selectedFile = files
        $scope.view_model();
      };
      $scope.download_files = function (files) { 
       let fnobj = {
          fileid: files.file_id, 
          categid: files.category_id,
          userid: $scope.userinfo.user_id,
        };  
        $rest.post("download_file", fnobj).then(
          function success(res) { 
           if (res.data) {
              window.open(res.data.success, '_blank');
              saberToast.success({
                title: "Download Files",
                text: "Download files has been successfully",
                delay: 200,
                duration: 1500,
                rtl: false,
                position: "top-right",
              });
            }else{
               saberToast.error({
                title: "Failed Download files",
                text: "No files found",
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
      $scope.rename_files = function (fileid, type) { 
        if (fileid > 0) {
          $rest.get(`rename_file?fileid=${fileid}&type=${type}`).then(
            function success(res) {
              console.log(res.data);
              $scope.foldername = res.data.category_name;
              $scope.folderlist = {
                categoryname: res.data.category_name,
                categoryid: res.data.category_id,
                categorypath: res.data.category_path,
              };
              $scope.file_modal();
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
      $scope.update_files = function (flnameobj) { 
        if (flnameobj.filename) {
          let fnobj = {
            fileid: flnameobj.fileid,
            filename: flnameobj.filename,
            userid: $scope.userinfo.user_id,
          }; 
          console.log(fnobj);
          $rest.post("update_file", fnobj).then(
            function success(res) {
              saberToast.success({
                title: "File Renamed",
                text: "Renamed file has been successfully",
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
            title: "File Name Required",
            text: "Please enter a name before renaming a file",
            delay: 200,
            duration: 1500,
            rtl: false,
            position: "top-right",
          });
          $state.reload();
        }
      };
      $scope.share_files = function(file, perm, sharefileobj){ 
        let changeNum = file.map(item => item.replace('number:', ''));
        let fnobj = { 
            sharedid: changeNum,
            userid: $scope.userinfo.user_id,
            fileid: sharefileobj.file_id,
            permssn: perm,
        } 
        $rest.post("share_files", fnobj).then(
          function success(res) { 
            saberToast.success({
              title: "Shared Files",
              text: "Shared files has been successfully",
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
      $scope.remove_files = function (file) {
        SweetAlert2.fire({
          title: "Continue to Remove?",
          text: "Your about to remove this files!",
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
                fileid: file.file_id, 
                userid: $scope.userinfo.user_id,
            }  
            $rest.post("remove_files", fnobj).then(
              function success(res) {
                saberToast.success({
                  title: "Remove Files",
                  text: "Remove files has been successfully",
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
      $scope.file_upload = function (files) {
        var formData = new FormData();
        angular.forEach(files, function (file) {
          formData.append("files[]", file, file.name);
        }); 
        formData.append("user_id", $scope.userinfo.user_id);
        formData.append("category_path", $scope.folderdata.category_path);
        formData.append("category_id", $scope.folderdata.category_id);
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

      $scope.file_modal = function (files) { 
        $scope.flnameobj = {
          fileid: files.file_id,
          categid: files.category_id,
          filename: files.file_name, 
          oldname: files.file_name,
        };
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/nfls-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
      };
      $scope.share_modal = function(file){  
        $scope.sharefileobj = file; 
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/share-file-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
      }
      $scope.view_model = function(){
         var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/vfls-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "lg",
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

      $scope.triggerFolderInput = function () {
        document.getElementById("filesInput").click();
      };

      $scope.formatSize = function (bytes) {
        if (bytes === 0 || bytes == null) return "0 Bytes";

        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

        return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
      };

      $scope.navigateto = function(url){
        $state.go(url);
      }
    }
  );
