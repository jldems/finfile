angular
  .module("app")
  .controller(
    "favorites",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2) {
      document.title = "Favorites | FinFile";

      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1;
      $scope.fsobj = [];
      $scope.flobj  = [];
      $scope.alltrashobj = [];
      $scope.sharefolderobj = [];

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.favorites");
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
        $scope.files_favorite($scope.userinfo.user_id);
        $scope.sf_favorites($scope.userinfo.user_id);
        $scope.folder_favorite($scope.userinfo.user_id);
      };

      $scope.setModified = function (val) {
        $scope.modifiedVal = val;
        $scope.files_favorite($scope.userinfo.user_id);
        $scope.sf_favorites($scope.userinfo.user_id);
        $scope.folder_favorite($scope.userinfo.user_id);
      };
      /* files */
      $scope.files_favorite= function (userid) { 
        $rest.get(`files_favorite?userid=${userid}`).then(
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
                  docs: ["doc", "docx", "ppt", "pptx"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx", "csv"],
                  txt: ["txt"],
                };

                const selected = $scope.flval.toLowerCase();
                const validTypes = typeMap[selected] || [selected];

                files = files.filter(file => {
                  const ext = file.ftype?.toLowerCase();
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
              $scope.fsobj = files;
            }else{
              $scope.trashobj = [];
            }
            $scope.merge_trash_lists();
          },
          function error(err) {
            console.error(err);
            $scope.fsobj = [];
          }
        );
      };
      $scope.files_favorite($scope.userinfo.user_id);
      /* shared files & folders */
      $scope.sf_favorites = function (userid) {
        $rest.get(`sf_favorites?userid=${userid}`).then(
          function success(res) {   
            if (res.data) {
              let files = res.data.map(function (file) {
                file.last_modified = new Date(file.last_modified.replace(" ", "T"));
                return file;
              });

              // Apply Type filter
              if ($scope.flval) {
                const typeMap = {
                  pdf: ["pdf"],
                  docs: ["doc", "docx", "ppt", "pptx"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx", "csv"],
                  txt: ["txt"],
                };

                const selected = $scope.flval.toLowerCase();
                const validTypes = typeMap[selected] || [selected]; // fallback to literal match

                files = files.filter(file => {
                  const ext = file.ftype?.toLowerCase();
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

              $scope.sffsobj = files;
            } else {
              $scope.sffsobj = [];
            }
            $scope.merge_trash_lists();
          },
          function error(err) {
            console.error(err);
            $scope.sffsobj = [];
          }
        );
      };
      $scope.sf_favorites($scope.userinfo.user_id);
      /* folders */
      $scope.folder_favorite = function (userid) { 
        $rest.get(`folder_favorite?userid=${userid}`).then(
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
                  docs: ["doc", "docx", "ppt", "pptx", "folder"],
                  img: ["jpg", "jpeg", "png", "gif", "webp"],
                  excel: ["xls", "xlsx", "csv"],
                  txt: ["txt"],
                };

                const selected = $scope.flval.toLowerCase();
                const validTypes = typeMap[selected] || [selected]; // fallback to literal match

                files = files.filter(file => {
                  const ext = file.ftype?.toLowerCase();
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
              $scope.flobj = files;
            }else{
              $scope.flobj = [];
            }
            $scope.merge_trash_lists();
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.folder_favorite($scope.userinfo.user_id);
      /* merging the 3 different arrays into 1 array */
      $scope.merge_trash_lists = function () {
 
        let flfav = Array.isArray($scope.fsobj) ? $scope.fsobj : [];
        let frfav = Array.isArray($scope.flobj) ? $scope.flobj : [];
        let sff = Array.isArray($scope.sffsobj) ? $scope.sffsobj : [];

        $scope.alltrashobj = flfav
        .concat(frfav, sff)
        .sort((a, b) => b.last_modified - a.last_modified)
        .map(item => {  
          return {
            id: item.id, 
            type: item.ftype,
            path: item.fpath,
            names: item.names,
            size: item.fsize,
            last_modified: item.last_modified,
            ownername: item.ownername,
            location: item.locations,
            ownerid: item.ownerid,
            permission: item.permission,
            is_favorite: item.is_favorite,
            moduletype: item.module_type,
          };
        });    
      }; 

      $scope.is_favorite = function(files){
        let fnobj = {
          id: files.id, 
          userid: $scope.userinfo.user_id,
          favorite: files.is_favorite == 0? 1 : 0,
          moduletype: files.moduletype,
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

      $scope.remove_favorite = function (file) {  
        let title = file.moduletype == 1? 'file' : file.moduletype == 2? 'folder': 'shared file';
        SweetAlert2.fire({
          title: `Continue to remove?`,
          text: `Your about to remove this ${title}!`,
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
                id: file.id, 
                moduletype: file.moduletype,
                userid: $scope.userinfo.user_id,
            }   
            console.log(fnobj);
            $rest.post("remove_favorite", fnobj).then(
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

      $scope.download_files = function (files) { 
        let fnobj = {
          fileid: files.id,
          userid: files.ownerid,
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
      $scope.update_files = function (flnameobj) { 
        if (flnameobj.filename) {
          let fnobj = {
            fileid: flnameobj.fileid,
            filename: flnameobj.filename,
            userid: $scope.userinfo.user_id,
          };   
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


      $scope.download_folder = function (files) {
        let fnobj = {
          categoryid: files.id,
          name: files.names,
          path: files.path,
          userid: files.ownerid,
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
      $scope.open_folder = function (files) {  
        let file = {
          category_id: files.id,
          category_name: files.names,
          category_path: files.path,
          category_size: files.size,
          file_owner: files.ownername,
          is_favorite: files.is_favorite,
          last_modified: files.last_modified, 
          module_type: files.moduletype,
          share_with: null,
        } 
        localStorage.setItem('folderfiles', JSON.stringify(file));
        $state.go("app.folder_files");
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

      $scope.file_modal = function (files) { 
        $scope.flnameobj = {
          fileid: files.id,
          categid: files.category_id,
          filename: files.names, 
          oldname: files.names,
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
        file.moduletype == 1? 
        $scope.sharefileobj = {
          file_name: file.names,
          file_owner: file.ownername,
          file_id: file.id,
        } : $scope.sharefolderobj = {
          category_name: file.names,
          last_updated_by: file.ownername,
          category_id: file.id,
        };  
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/${file.moduletype == 1? 'share-file-modal.php' : 'share-folder-modal.php'}`,
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
            $scope.userobj = res.data.filter(user => user.user_id !== $scope.userinfo.user_id);
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
