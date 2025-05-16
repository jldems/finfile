angular
  .module("app")
  .controller(
    "sharedfiles",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2) {
      document.title = "Shared Files | FinFile";
 
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
          $state.go("app.sharedfiles");
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
      $scope.typefilter = function (val) {
        $scope.typeval = val;
        $scope.sf_list($scope.userinfo.user_id);
      };
      $scope.flfilter = function (val) { 
        if(val){
          $scope.flval = val.full_name;
          $scope.filuserid = val.user_id;
          $scope.sf_list($scope.userinfo.user_id);
        }else{
          $scope.flval = false;
        }
      };
      $scope.setModified = function (val) {
        $scope.modifiedVal = val;
        $scope.sf_list($scope.userinfo.user_id);
      };
  
      $scope.sf_list = function (userid) {
        $rest.get(`sf_list?userid=${userid}`).then(
          function success(res) { 
            if (res.data) {
              let files = res.data.map(function (file) {
                file.shared_at = new Date(file.shared_at.replace(" ", "T"));
                return file;
              });

              // Apply People filter
              if ($scope.filuserid) { 
                files = files.filter(file => file.shared_by === $scope.filuserid);
              }

              // Apply Type filter
              if ($scope.typeval) {
                const typeMap = {
                  pdf: ["pdf"],
                  docs: ["doc", "docx"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx"]
                };

                const selected = $scope.typeval.toLowerCase();
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

              $scope.shfilesobj = files;
            } else {
              $scope.shfilesobj = [];
            }
          },
          function error(err) {
            console.error(err);
            $scope.shfilesobj = [];
          }
        );
      };
      $scope.sf_list($scope.userinfo.user_id);

      $scope.sf_download = function (files) {
        let fnobj = {
          fileid: files.file_id,
          categid: files.category_id? files.category_id : 0,
          userid: files.shared_by, 
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
                title: "Download Shared Files",
                text: "Download shared files has been successfully",
                delay: 200,
                duration: 1500,
                rtl: false,
                position: "top-right",
              });
            }else{
               saberToast.error({
                title: "Failed Download shared files",
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
      $scope.sf_rename = function (fileid, type) {
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
      $scope.sf_update = function (foldername, folderlist) {
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
      $scope.sf_remove = function(file){
        SweetAlert2.fire({
          title: "Continue to Remove?",
          text: "Your about to remove this shared file!",
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
                filename: file.file_name,
                ushareid: file.shared_with,
                username: $scope.userinfo.full_name,
            } 
            $rest.post("sf_remove", fnobj).then(
              function success(res) {
                saberToast.success({
                  title: "Remove Shared File",
                  text: "Remove shared file has been successfully",
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

      $scope.is_favorite = function(files, val){
        let fnobj = {
          id: files.file_id || files.category_id, 
          userid: $scope.userinfo.user_id,
          favorite: files.is_favorite == 0? 1 : 0,
          trigquery: val,
        };     
        $rest.post("is_favorite", fnobj).then(
          function success(res) { 
            $state.reload();
          },
          function error(err) {
            console.error(err);
          }
        );
      }

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
