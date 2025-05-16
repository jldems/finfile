angular
  .module("app")
  .controller("overview", function ($scope, $state, $decrypt, $filter, $rest, $uibModal, SweetAlert2) {
    document.title = "Overview | FinFile";

    let ff_user = localStorage.getItem("ff_user");
    let descrypted_o = ff_user ? $decrypt.decrypted(ff_user) : "";
    $scope.userinfo = ff_user ? JSON.parse(descrypted_o) : "";
    $scope.items_per_page = 50;
    $scope.current_page = 1;

    $scope.todayDate = $filter("date")(new Date(), "MMM dd, yyyy");
    var date = new Date();
    date.setDate(date.getDate() - 7);
    $scope.startDate = date;
    $scope.endDate = new Date();
    $scope.tiobj = [];
    $scope.tdobj = [];

    $scope.xlabel = JSON.parse(localStorage.getItem("date_range_lbl"));
    $scope.inrange = "weekly";

    $scope.dateOptions = [
      { label: "Today" },
      { label: "Last 7 days" },
      { label: "Last 30 days" },
      { label: "This year (2025)" },
      { label: "Last year (2024)" },
    ];

    $scope.setModified = function (val) {
      $scope.modifiedVal = val;
      $scope.recent_files($scope.userinfo.user_id);
      $scope.suggest_files($scope.userinfo.user_id);
    };

    $scope.check_loggedIn = function () {
      let ff_user = localStorage.getItem("ff_user");
      if (ff_user) {
        $state.go("app.overview");
      } else {
        $state.go("login");
      }
    };
    $scope.check_loggedIn();
    
    $scope.recent_files = function(userid){   
      $rest.get(`recent_files?userid=${userid}`).then(
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
            $scope.rfobj = files;
          }else{
            $scope.rfobj = [];
          } 
        },
        function error(err) {
          console.error(err);
          $scope.rfobj = [];
        }
      );
    }
    $scope.recent_files($scope.userinfo.user_id);

    $scope.suggest_files = function(userid){
      $rest.get(`suggest_files?userid=${userid}`).then(
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
              $scope.sfobj = files;
            }else{
              $scope.sfobj = [];
            } 
          },
          function error(err) {
            console.error(err);
            $scope.sfobj = [];
          }
        );
    }
    $scope.suggest_files($scope.userinfo.user_id);

    $scope.total_documents = function(userid){
      $rest.get(`total_documents?userid=${userid}`).then(
        function success(res) {    
          $scope.tdobj = res.data; 
        },
        function error(err) {
          console.error(err);
          $scope.tdobj = [];
        }
      );
    }
    $scope.total_documents($scope.userinfo.user_id);
    $scope.total_folder = function(userid){
      $rest.get(`total_folder?userid=${userid}`).then(
        function success(res) {   
          $scope.tfobj = res.data; 
        },
        function error(err) {
          console.error(err);
          $scope.tdobj = [];
        }
      );
    }
    $scope.total_folder($scope.userinfo.user_id);
    $scope.total_image = function(userid){
      $rest.get(`total_image?userid=${userid}`).then(
        function success(res) {    
          $scope.tiobj = res.data; 
        },
        function error(err) {
          console.error(err);
          $scope.tiobj = [];
        }
      );
    }
    $scope.total_image($scope.userinfo.user_id);

    $scope.total_team = function(userid){
      $rest.get(`total_team?userid=${userid}`).then(
        function success(res) {   
          $scope.ttobj = res.data; 
        },
        function error(err) {
          console.error(err);
          $scope.tiobj = [];
        }
      );
    }
    $scope.total_team($scope.userinfo.user_id);

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
      var allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
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
              $state.go('app.myfiles.folders', {}, {reload: true});
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

    $scope.create_modal = function (val) {
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

    $scope.isType = function(file) {
      if (!file || !file.file_type) {
          return 'https://dummyimage.com/300x180/343a40/ffffff.png&text=Unknown';
      }

      const ext = file.file_type.toLowerCase();

      if (ext === 'pdf') {
          return 'src/assets/images/pdf.png';
      } else if (['doc', 'docx'].includes(ext)) {
          return 'src/assets/images/word.png';
      } else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
         return 'src/assets/images/image.png';
      } else if (['xls', 'xlsx'].includes(ext)) {
          return 'src/assets/images/excel.png';
      } else if (['ppt', 'pptx'].includes(ext)) {
          return 'src/assets/images/ppt.png';
      } else if (['txt'].includes(ext)) {
          return 'src/assets/images/txt.png';
      } else if (['csv'].includes(ext)) {
          return 'src/assets/images/csv.png';
      } else {
          return 'https://dummyimage.com/300x180/343a40/ffffff.png&text=Unknown';
      }
    };

    $scope.formatSize = function (bytes) {
      if (bytes === 0 || bytes == null) return "0 Bytes";

      var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

      return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
    };
    $scope.getPercentage = function(totalsize) {
        const maxSize = 10737418240;
        let percentage = (totalsize / maxSize) * 100; 
        return Math.min(Math.max(percentage, 0), 100); // Cap between 0 and 100
    };

  });
