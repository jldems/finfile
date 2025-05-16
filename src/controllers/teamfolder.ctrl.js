angular
  .module("app")
  .controller(
    "teamfolder",
    function ($scope, $state, $filter, $rest, $http, $decrypt, $uibModal, SweetAlert2, $location) {
      document.title = "Team Folder | FinFile";

      let ff_user = localStorage.getItem("ff_user");
      let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
      $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
      $scope.items_per_page = 50;
      $scope.current_page = 1;
      $scope.ffileobj = []; 
      $scope.currentpath = $location.path();
      $scope.teammember = [];

      let tf_files = localStorage.getItem("teamfolder");
      $scope.teamfolderdata = tf_files? JSON.parse(tf_files) : "";  

      $scope.check_loggedIn = function () {
        let ff_user = localStorage.getItem("ff_user");
        if (ff_user) {
          $state.go("app.teamfolder_files");
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
        $scope.team_list($scope.userinfo.user_id);
      };

      $scope.file_list = function (userid) {  
        $rest.get(`file_list?categoryid=${0}&userid=${userid}&teamid=${$scope.teamfolderdata.team_id}`).then(
          function success(res) {  
            console.log(res.data);
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

                $scope.ffileobj = files;
              } else {
                $scope.ffileobj = [];
              }
          },
          function error(err) {
            console.error(err);
            $scope.folderobj = [];
          }
        );
      };
      $scope.file_list($scope.userinfo.user_id);
      $scope.team_list = function(userid){
        $rest.get(`team_list?userid=${userid}`).then(
          function success(res) { 
            if (res.data) {
              let files = res.data.map(function (file) {
                file.created_at = new Date(file.created_at.replace(" ", "T"));
                return file;
              });

              // Apply Modified filter
              if ($scope.modifiedVal) {
                const now = new Date();
                files = files.filter(file => {
                    const modified = file.created_at;

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

                $scope.tmobj = files;
              } else {
                $scope.tmobj = [];
              }
          },
          function error(err) {
            console.error(err);
            $scope.tmobj = [];
          }
        );
      }
      $scope.team_list($scope.userinfo.user_id);

      $scope.team_open = function(teams){ 
        localStorage.setItem('teamfolder', JSON.stringify(teams));
        $state.go("app.teamfolder", {}, {reload: true});
      }
      $scope.download_team = function (files) { 
        let fnobj = {
          fileid: files.file_id,  
          teamname: $scope.teamfolderdata.team_name,
          teamid: files.team_id, 
          filename: files.fullfl_name,
          userid: $scope.userinfo.user_id,
        };    
        $rest.post("download_team", fnobj).then(
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
      $scope.rename_files = function (fileid, type) { 
        if (fileid > 0) {
          $rest.get(`rename_file?fileid=${fileid}&type=${type}`).then(
            function success(res) {
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
            oldname: flnameobj.oldname,
            userid: $scope.userinfo.user_id,
            teamname: $scope.teamfolderdata.team_name,
            filetype: flnameobj.filetype,
          };    
          $rest.post("update_team", fnobj).then(
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
      $scope.team_upload = function (files) {
        var formData = new FormData();
        angular.forEach(files, function (file) {
          var sanitizedFileName = file.name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '_').replace(/\s+/g, '_');
          formData.append("files[]", file, sanitizedFileName);
        }); 
        formData.append("user_id", $scope.userinfo.user_id); 
        formData.append("user_name", $scope.userinfo.full_name); 
        formData.append("team_id", $scope.teamfolderdata.team_id);
        formData.append("team_name", $scope.teamfolderdata.team_name);

        $http
          .post("api/upload_team", formData, {
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
      $scope.team_members = function (teamid) {  
        $scope.teammembers_modal(); 
        $rest.get(`team_members?teamid=${teamid}`).then(
          function success(res) {
            let files = res.data.map(function (file) {
              file.added_at = new Date(file.added_at.replace(" ", "T"));
              return file;
            }); 
            $scope.tmmobj = files;
          },
          function error(err) {
            console.error(err); 
          }
        );
      };
      $scope.team_remove = function(file){
        SweetAlert2.fire({
          title: "Continue to Remove?",
          text: "Your about to remove this member!",
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
                teamid: file.team_id,
                userid: file.user_id,  
            }   
            $rest.post("team_remove", fnobj).then(
              function success(res) {
                saberToast.success({
                  title: "Remove Member",
                  text: "Remove member has been successfully",
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
      }
      $scope.team_add = function(teammember){
        let changeNum = teammember.map(item => item.replace('number:', ''));
        let fnobj = {
          teamuserid: changeNum,
          teamid: $scope.teamfolderdata.team_id,
          userid: $scope.userinfo.user_id,
        };     
        $rest.post("team_add", fnobj).then(
          function success(res) {
            saberToast.success({
              title: "Team Member",
              text: "Team member has been successfully Added",
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

      $scope.is_favorite = function(files){
        let fnobj = {
          id: files.file_id || files.category_id, 
          userid: $scope.userinfo.user_id,
          favorite: files.is_favorite == 0? 1 : 0,
          moduletype: files.module_type,
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

      //folders
      $scope.download_folder = function (files) {
        let fnobj = {
          teamid: files.team_id,
          name: files.team_name, 
          userid: $scope.userinfo.user_id,
        };  
        $rest.post("team_download_folder", fnobj).then(
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
      $scope.teammembers_modal = function(){
        var $uibModalInstance = $uibModal.open({
          animation: true,
          templateUrl: `src/templates/modals/tmm-modal.php`,
          backdrop: true,
          scope: $scope,
          size: "md",
        });
        $scope.closeModal = function () {
          $uibModalInstance.close();
        };
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
      $scope.file_modal = function (files) { 
        $scope.flnameobj = {
          fileid: files.file_id,
          categid: files.category_id,
          filename: files.file_name,
          filetype: files.file_type, 
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

      $scope.triggerFolderInput = function () {
        document.getElementById("filesInput").click();
      };

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
        console.log(fnobj);
        $rest.post("unlink_zip", fnobj).then(
          function success(res) {
            console.log(res);  
          },
          function error(err) {
            console.error(err);
          }
        );
      }
      

      $scope.navigateto = function(url){
        $state.go(url);
      }
    }
  );
