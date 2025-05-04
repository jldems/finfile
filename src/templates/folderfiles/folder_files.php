
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-end">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0" ng-click="navigateto('app.myfiles')" type="button"><i class="fa-regular fa-files me-2"></i> My Files <span ng-show="folderdata"><i class="fa-solid fa-angle-right me-1"></i>{{folderdata.category_name}}</span></h6>
        </div>
        <div class="col-lg-4">
            <div class="d-flex align-items-end justify-content-end" style="gap:10px"> 
                <input type="file" id="filesInput" multiple onchange="angular.element(this).scope().file_upload(this.files)" style="display: none;">
                <button class="btn btn-ff-primary" ng-click="triggerFolderInput()" for="filesInput">
                    <i class="fa-regular fa-file-plus me-2"></i> File Upload
                </button> 
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
    <div class="row mt-5"> 
        <div class="col-lg-12">
            <div class="table-in">
                <table class="table align-middle">
                    <thead>
                        <tr> 
                            <th class="fw-semibold" >Name</th>
                            <th class="fw-semibold" width="10%">Size</th>
                            <th class="fw-semibold" width="10%">Shared</th>
                            <th class="fw-semibold" width="10%">Last Modified</th>
                            <th class="fw-semibold text-center" width="10%">Last Update</th>
                            <th class="fw-semibold text-center" width="1%" nowrap>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="files in filtered = (ffileobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.file_name}}</td>
                            <td>{{formatSize(files.file_size)? formatSize(files.file_size) : 0}}</td>
                            <td>{{files.shared_with? files.shared_with : 'None'}}</td>
                            <td>{{files.last_modified | date: 'MMM dd, yyyy hh:mm a'}}</td>
                            <td class="text-center">{{files.last_updated_by}}</td>
                            <td class="text-center">
                                <div class="dropdown btn-dropdown">
                                    <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-regular fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" ng-click="open_files(files)"><i class="fa-regular fa-file-arrow-up me-2"></i> Open</a>
                                        </li>
                                        <li> 
                                            <a class="dropdown-item" ng-click="download_files(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="file_modal(files)"><i class="fa-regular fa-pen-to-square me-2"></i> Rename</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="share_modal(files)"><i class="fa-regular fa-share-from-square me-2"></i> Share</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="remove_files(files)"><i class="fa-regular fa-trash me-2"></i> Remove</a>
                                        </li> 
                                    </ul>
                                </div>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex align-items-center justify-content-end pt-3">
                <ul style="margin-bottom: 0 !important;" uib-pagination total-items="filtered.length" num-pages="numPages" items-per-page="items_per_page" ng-model="current_page" max-size="5" boundary-link-numbers="true" ng-change="pageChanged()"></ul>
            </div>
        </div>
    </div>
</div>