<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-end">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0"><i class="fa-regular fa-files me-2"></i> My Files</h6>
        </div>
        <div class="col-lg-4">
            <div class="d-flex align-items-end justify-content-end" style="gap:10px"> 
               <div class="dropdown btn-dropdown">
                    <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-plus me-2"></i> New
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <input type="file" id="filesInput" multiple onchange="angular.element(this).scope().file_upload(this.files)" style="display: none;">
                            <a class="dropdown-item" ng-click="triggerFolderInput()" for="filesInput"><i class="fa-regular fa-file-arrow-up me-2"></i> File Upload</a>
                        </li>
                        <li> 
                            <a class="dropdown-item" ng-click="folder_modal(1)"><i class="fa-regular fa-folder-plus me-2"></i> New Folder</a>
                        </li> 
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-5">
        <div class="col-lg-6">
            <div class="d-flex align-item-center justify-content-start gap-3">
                <div class="input-form-grp-search w-50">
                    <input type="text" placeholder="Search..." ng-model="search">
                    <i class="fa-solid fa-search"></i>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="dropdown filter-dropdown">
                        <button class="btn btn-ff-sec dropdown-toggle"
                        ng-class="flval ? 'btn-ff-primary' : 'btn-ff-sec'"
                        type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ flval || 'Type' }}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" ng-click="flfilter('Folders')"><i class="fa-regular fa-folder me-2"></i> Folders</a></li>
                            <li><a class="dropdown-item" ng-click="flfilter('Documents')"><i class="fa-regular fa-file-invoice me-2"></i> Documents</a></li> 
                        </ul>
                        <button class="btn btn-danger" ng-if="flval"><i class="fa-regular fa-xmark"></i></button>
                    </div> 
                </div> 
                <div class="d-flex align-items-center gap-3"> 
                    <div class="dropdown filter-dropdown">
                        <button class="btn btn-ff-sec dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Modified
                        </button>
                        <ul class="dropdown-menu">
                            <li ng-repeat="do in dateOptions"><a class="dropdown-item" href="#">{{do.label}}</a></li> 
                        </ul>
                        <!-- <button class="btn btn-danger"><i class="fa-regular fa-xmark"></i></button> -->
                    </div>
                </div> 
            </div>
        </div> 
    </div>
    <div class="row"> 
        <div class="col-lg-12">
            <tab-container>
                <nav>
                    <a ui-sref="app.myfiles.folders" ui-sref-active="active-tab">Folders</a>
                    <a ui-sref="app.myfiles.files" ui-sref-active="active-tab">Files</a>
                </nav>
                <tab-content>
                    <div ui-view></div>
                </tab-content>
            </tab-container>
        </div>
    </div>
</div>