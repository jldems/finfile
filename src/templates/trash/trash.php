
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0" ng-click="navigateto('app.myfiles')" type="button"><i class="fa-regular fa-trash-can me-2"></i> Trash <span ng-show="folderdata"><i class="fa-solid fa-angle-right me-1"></i>{{folderdata.category_name}}</span></h6>
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
                    <div class="d-flex align-items-center gap-1 filter-dropdown"> 
                        <div class="btn-group">
                            <button class="btn btn-ff-sec dropdown-toggle"
                                ng-class="flval ? 'btn-ff-primary' : 'btn-ff-sec'"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ flval || 'Type' }}
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" ng-click="flfilter('PDF')"><i class="fa-regular fa-file-pdf me-2"></i> PDF</a></li>
                                <li><a class="dropdown-item" ng-click="flfilter('Docs')"><i class="fa-regular fa-file me-2"></i> Docs</a></li> 
                                <li><a class="dropdown-item" ng-click="flfilter('Img')"><i class="fa-regular fa-image me-2"></i> Image</a></li> 
                                <li><a class="dropdown-item" ng-click="flfilter('Excel')"><i class="fa-regular fa-file-excel me-2"></i> Excel</a></li>
                                <li><a class="dropdown-item" ng-click="flfilter('Txt')"><i class="fa-solid fa-file-pen me-2"></i> Txt</a></li> 
                            </ul>
                        </div>
                        <button class="btn btn-danger" ng-if="flval" ng-click="flfilter(null)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="d-flex align-items-center gap-1 filter-dropdown">
                        <div class="btn-group">
                            <button class="btn btn-ff-sec dropdown-toggle"
                                ng-class="modifiedVal ? 'btn-ff-primary' : 'btn-ff-sec'"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ modifiedVal || 'Modified' }}
                            </button>
                            <ul class="dropdown-menu">
                                <li ng-repeat="do in dateOptions">
                                    <a class="dropdown-item" ng-click="setModified(do.label)">{{do.label}}</a>
                                </li> 
                            </ul>
                        </div>
                        <button class="btn btn-danger" ng-if="modifiedVal" ng-click="setModified(null)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
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
                            <th class="fw-semibold" width="16%">Date Trash</th>
                            <th class="fw-semibold" width="10%">Type</th>
                            <th class="fw-semibold" width="10%">Owner</th>
                            <th class="fw-semibold" width="10%">Size</th>
                            <th class="fw-semibold" width="10%">Location</th>
                            <th class="fw-semibold text-center" width="1%" nowrap>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="files in filtered = (alltrashobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.file_name}}</td>
                            <td>{{files.last_modified | date: 'MMM dd, yyyy hh:mm a'}}</td>
                            <td>{{files.file_type}}</td>
                            <td>{{files.file_owner}}</td>
                            <td>{{formatSize(files.file_size)? formatSize(files.file_size) : 0}}</td>  
                            <td>{{files.owner_id != userinfo.user_id? 'Shared File' : files.file_type == 'Folder' || !files.category_name? 'My Files' : files.category_name}}</td> 
                            <td class="text-center">
                            <div class="d-flex align-items-center justify-content-center">
                                <div class="dropdown btn-dropdown">
                                    <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-regular fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li> 
                                            <a class="dropdown-item" ng-click="files.file_type == 'Folder'? download_folder(files) : download_files(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="restore_files(files)"><i class="fa-regular fa-trash-undo me-2"></i> Restore</a>
                                        </li>
                                        <li> 
                                            <a class="dropdown-item" ng-click="delete_forever(files)"><i class="fa-regular fa-trash-xmark me-2"></i> Delete Forever</a>
                                        </li> 
                                    </ul>
                                </div>
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