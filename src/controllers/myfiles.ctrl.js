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
      $scope.foldername = "";
      
      $scope.usershare =  -1;
      $scope.permission =  "";

      $scope.current_path = function(path){ 
        localStorage.setItem('myfilespath', JSON.stringify(path));
      }

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
      $scope.flfilter = function (val) {
        $scope.flval = val;
        $scope.file_list($scope.userinfo.user_id); 
      };

      $scope.setModified = function (val) {
        $scope.modifiedVal = val;
        $scope.file_list($scope.userinfo.user_id);
        $scope.folder_list($scope.userinfo.user_id);
      };
  
      $scope.file_list = function (userid) {
        $rest.get(`file_list?categoryid=0&userid=${userid}&teamid=${0}`).then(
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

              $scope.fileobj = files;
            } else {
              $scope.fileobj = [];
            }
          },
          function error(err) {
            console.error(err);
            $scope.fileobj = [];
          }
        );
      };
      $scope.file_list($scope.userinfo.user_id);
      $scope.view_files = function(){
        $scope.view_modal();
      }
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
            fullfl_name: sharefileobj.fullfl_name,
            username: $scope.userinfo.full_name,
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
        var allowedTypes = [
          "application/pdf",
          "application/msword", // .doc
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/vnd.ms-excel", // .xls
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
          "application/vnd.ms-powerpoint", // .ppt
          "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
          "text/plain", // .txt
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp"
        ];

        var formData = new FormData();
        var validFiles = [];

        angular.forEach(files, function (file) {
          if (allowedTypes.includes(file.type)) {
            var sanitizedFileName = file.name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '_').replace(/\s+/g, '_');
            formData.append("files[]", file, sanitizedFileName);
            validFiles.push(sanitizedFileName);
          } else {
            console.warn("Rejected file:", file.name, "Type:", file.type);
          }
        });

        if (validFiles.length === 0) {
          saberToast.error({
            title: "Upload Error",
            text: "Only PDF, Word, Excel, or image files are allowed",
            delay: 200,
            duration: 1500,
            rtl: false,
            position: "top-right",
          }); 
          return;
        }

        formData.append("user_id", $scope.userinfo.user_id);
        formData.append("category_path", `../uploads/${$scope.userinfo.user_id}`);
        formData.append("category_id", 0);
        formData.append("category_name", 'My Files');

        $http
          .post("api/upload_file", formData, {
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined },
          })
          .then(function (response) {
            saberToast.success({
                title: "Upload Files",
                text: "Upload files has been successfully",
                delay: 200,
                duration: 1500,
                rtl: false,
                position: "top-right",
              });
              $state.reload();
          })
          .catch(function (error) {
            console.error("Upload error:", error);
          });
      };

      $scope.is_favorite = function(files){
        let fnobj = {
          id: files.file_id || files.category_id, 
          userid: $scope.userinfo.user_id,
          favorite: files.is_favorite == 0? 1 : 0,
          moduletype: files.module_type,
        };    
        console.log(fnobj);
        $rest.post("is_favorite", fnobj).then(
          function success(res) { 
            $state.reload();
          },
          function error(err) {
            console.error(err);
          }
        );
      }
      
      //folders
      $scope.folder_list = function (userid) { 
        $rest.get(`folder_list?userid=${userid}`).then(
          function success(res) {
            if(res.data){ 

                let files = res.data.map(function (file) {
                  file.last_modified = new Date(file.last_modified.replace(" ", "T"));
                  return file;
                });

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

                $scope.folderobj = files;
            }else{
              $scope.folderobj = [];
            }
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.folder_list($scope.userinfo.user_id);
      $scope.new_folder = function (foldername) {
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
      $scope.share_folder = function(file, perm, sharefolderobj){ 
       
        let changeNum = file.map(item => item.replace('number:', ''));
        let fnobj = { 
            sharedid: changeNum,
            userid: $scope.userinfo.user_id,
            categoryid: sharefolderobj.category_id,
            permssn: perm,
            categname :sharefolderobj.category_name,
            username: $scope.userinfo.full_name,
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

      $scope.triggerFolderInput = function () {
        document.getElementById("filesInput").click();
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
      $scope.share_modal = function(file, val){  
        val == 0? $scope.sharefileobj = file : $scope.sharefolderobj = file; 
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/${val == 0? 'share-file-modal.php' : 'share-folder-modal.php'}`,
          backdrop: true,
          scope: $scope,
          size: "sm",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
      }
      $scope.view_modal = function(){
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/view-modal.php`,
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
