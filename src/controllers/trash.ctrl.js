angular
  .module("app")
  .controller(
    "trash",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2) {
      document.title = "Trash | FinFile";

      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1;
      $scope.recentobj = [];
      $scope.sharedrecentobj  = [];

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.trash");
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
        $scope.flval = val;
        $scope.recent_list($scope.userinfo.user_id);
      };

      $scope.setModified = function (val) {
        $scope.modifiedVal = val;
        $scope.recent_list($scope.userinfo.user_id);
      };

      $scope.trash_list = function (userid) { 
        $rest.get(`trash_list?userid=${userid}`).then(
          function success(res) { 
            if(res.data){ 
              let files = res.data.map(function (file) {
                file.last_modified = new Date(file.last_modified.replace(" ", "T"));
                return file;
              });

              // Apply Type filter
              if ($scope.flval) {
                const typeMap = {
                  pdf: ["pdf"],
                  docs: ["doc", "docx"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx", "csv"],
                  txt: ["txt"],
                };

                const selected = $scope.flval.toLowerCase();
                const validTypes = typeMap[selected] || [selected]; // fallback to literal match

                files = files.filter(file => {
                  const ext = file.file_type?.toLowerCase();
                  return ext && validTypes.includes(ext);
                });
              }

              // Apply Modified filter
              if ($scope.modifiedVal) {
                const now = new Date();
                files = files.filter(file => {
                  const modified = file.last_modified;

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
              $scope.trashobj = files;
            }else{
              $scope.trashobj = [];
            }
            $scope.merge_trash_lists();
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.trash_list($scope.userinfo.user_id);

      $scope.folder_trash_list = function (userid) { 
        $rest.get(`trashfolder_list?userid=${userid}`).then(
          function success(res) {  
            if(res.data){ 
              let files = res.data.map(function (file) {
                file.last_modified = new Date(file.last_modified.replace(" ", "T"));
                return file;
              });

              // Apply Type filter
              if ($scope.flval) {
                const typeMap = {
                  pdf: ["pdf"],
                  docs: ["doc", "docx"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx"]
                };

                const selected = $scope.flval.toLowerCase();
                const validTypes = typeMap[selected] || [selected]; // fallback to literal match

                files = files.filter(file => {
                  const ext = file.file_type?.toLowerCase();
                  return ext && validTypes.includes(ext);
                });
              }

              // Apply Modified filter
              if ($scope.modifiedVal) {
                const now = new Date();
                files = files.filter(file => {
                  const modified = file.last_modified;

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
              $scope.foldertrashobj = files;
            }else{
              $scope.foldertrashobj = [];
            }
            $scope.merge_trash_lists();
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.folder_trash_list($scope.userinfo.user_id);
      $scope.merge_trash_lists = function () {
 
        let trash = Array.isArray($scope.trashobj) ? $scope.trashobj : [];
        let trashfolder = Array.isArray($scope.foldertrashobj) ? $scope.foldertrashobj : [];

        $scope.alltrashobj = trash
        .concat(trashfolder)
        .sort((a, b) => b.last_modified - a.last_modified)
        .map(item => { 
          return {
            file_id: item.file_id,
            category_id: item.category_id,
            category_path: item.category_path || item.file_path,
            file_name: item.file_name || item.category_name,
            last_modified: item.last_modified,
            file_type: item.file_type || 'Folder',
            file_owner: item.file_owner,
            file_size: item.file_size || item.category_size,
            owner_id: item.owner_id,
            category_name: item.category_name,
          };
        });  
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
              const link = document.createElement('a');
              link.href = res.data.success;
              link.download = '';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
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

      $scope.restore_files = function(files){
         let fnobj = {
            fileid: files.file_id? files.file_id : 0 ,
            categid: files.category_id? files.category_id : 0, 
            userid: $scope.userinfo.user_id,
          };    
          $rest.post("restore_files", fnobj).then(
            function success(res) {
              saberToast.success({
                title: "Restored Files",
                text: "Resotred file has been successfully",
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
      $scope.delete_forever = function (file) {
        SweetAlert2.fire({
          title: "Continue to Delete?",
          text: "Your about to delete forever this files!",
          icon: "question",
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonColor: "#ff6913",
          cancelButtonColor: "#383838",
          cancelButtonClass: "text-white",
          confirmButtonText: "Delete",
          position: "center",
          iconColor: "#ff6913",
        }).then((result) => {
          if (result.value) { 
            let cleanPath = file.category_path.replace(/\.\.\//g, '');
            let fullPath = '/finfile/' + cleanPath;

            let fnobj = {
                fileid: file.file_id? file.file_id : 0,
                categid: file.category_id? file.category_id: 0,
                userid: $scope.userinfo.user_id,
                path:  fullPath,
            }  
            $rest.post("delete_forever", fnobj).then(
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

      $scope.formatSize = function (bytes) {
        if (bytes === 0 || bytes == null) return "0 Bytes";

        var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

        return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
      };
      $scope.navigateto = function(url){
        $state.go(url);
      }
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
