<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0"><i class="fa-light fa-grid-2 me-2"></i> Overview Files</h6>
        </div>
        <div class="col-lg-4">
            <div class="d-flex align-items-end justify-content-end" style="gap:10px">
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
                <button class="btn btn-ff-primary" tooltip="Create New Folder" flow="down" ng-click="create_modal(1)">
                    <i class="fa-solid fa-plus me-2"></i> Create
                </button>
            </div>
        </div>
    </div>

    <div class="row mt-5">
        <div class="col-lg-12 mb-4">
            <h5 class="fw-bold"> Overview Files</h5>
            <small>Date: {{todayDate}}</small>
        </div> 
        <!-- image -->
        <div class="col-lg-3">
            <div class="card-mng rounded-3 px-3 py-3">
                <div class="d-flex align-items-center">
                    <div class="icon-fier orange rounded-3">
                        <i class="fa-regular fa-image"></i>
                    </div>
                    <div class="ms-3">
                        <div class="title">Image</div>
                        <div class="text-fier">{{tiobj.totalimg}} Img</div>
                    </div>
                </div>
                <div class="d-block align-items-center mt-3">
                    <div class="progress custom-progress" role="progressbar" aria-label="Basic example" aria-valuenow="{{formatSize(tiobj.totalsize)}}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar custom-progress-bar orange"
                            :style="{ width: getPercentage(tiobj.totalsize) + '%' }">
                        </div>
                    </div>
                    <div class="text-fier mt-2">{{formatSize(tiobj.totalsize)}} as of Today</div>
                </div>
            </div>
        </div> 
        <div class="col-lg-3">
            <div class="card-mng rounded-3 px-3 py-3">
                <div class="d-flex align-items-center">
                    <div class="icon-fier blue rounded-3">
                        <i class="fa-regular fa-folder"></i>
                    </div>
                    <div class="ms-3">
                        <div class="title">Folder</div>
                        <div class="text-fier">{{tfobj.totalfolder}} Folder</div>
                    </div>
                </div>
                <div class="d-block align-items-center mt-3">
                    <div class="progress custom-progress" role="progressbar" aria-label="Basic example" aria-valuenow="{{getPercentage(tfobj    .totalsize)}}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar custom-progress-bar blue"
                            :style="{ width: getPercentage(tfobj.totalsize) + '%' }">
                        </div>
                    </div>
                    <div class="text-fier mt-2">{{formatSize(tfobj.totalsize)}} as of Today</div>
                </div>
            </div>
        </div> 
        <div class="col-lg-3">
            <div class="card-mng rounded-3 px-3 py-3">
                <div class="d-flex align-items-center">
                    <div class="icon-fier green rounded-3">
                        <i class="fa-regular fa-file"></i>
                    </div>
                    <div class="ms-3">
                        <div class="title">Document</div>
                        <div class="text-fier">{{tdobj.totaldocs}} Docs</div>
                    </div>
                </div>
                <div class="d-block align-items-center mt-3">
                    <div class="progress custom-progress" role="progressbar" aria-label="Basic example" aria-valuenow="{{getPercentage(tdobj.totalsize)}}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar custom-progress-bar green"
                            :style="{ width: getPercentage(tdobj.totalsize) + '%' }">
                        </div>
                    </div>
                    <div class="text-fier mt-2">{{formatSize(tdobj.totalsize)}} as of Today</div>
                </div>
            </div>
        </div> 
        <div class="col-lg-3">
            <div class="card-mng rounded-3 px-3 py-3">
                <div class="d-flex align-items-center">
                    <div class="icon-fier yellow rounded-3">
                        <i class="fa-regular fa-file"></i>
                    </div>
                    <div class="ms-3">
                        <div class="title">Team Folders</div>
                        <div class="text-fier">{{ttobj.totalfolder}} Folder</div>
                    </div>
                </div>
                <div class="d-block align-items-center mt-3">
                    <div class="progress custom-progress" role="progressbar" aria-label="Basic example" aria-valuenow="{{getPercentage(ttobj.totalsize)}}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar custom-progress-bar green"
                            :style="{ width: getPercentage(ttobj.totalsize) + '%' }">
                        </div>
                    </div>
                    <div class="text-fier mt-2">{{formatSize(ttobj.totalsize)}} as of Today</div>
                </div>
            </div>
        </div> 
    </div>
    <div class="row mt-5">
        <div class="col-lg-12 mb-2">
            <h5 class="fw-bold"> Suggested Files</h5>
            <small>Date: {{todayDate}}</small>
        </div> 
        <!-- image -->
        <div class="col-md-3  mt-3" ng-repeat="files in sfobj">
            <div class="card file-card h-100 position-relative">
                <img ng-src="{{isType(files) || 'https://dummyimage.com/300x180/343a40/ffffff.png&text=Google+testing'}}" class="card-img-top" alt="Preview"> 
                <div class="d-flex align-items-center justify-content-between p-3 card-footer">
                    <div class="text-truncate">
                        <i class="fa-regular fa-file-lines me-2"></i> {{files.file_name}}
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                            <div class="dropdown btn-dropdown">
                                <a class=" dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <li> 
                                        <a class="dropdown-item" ng-click="download_files(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                    </li> 
                                    <li> 
                                        <a class="dropdown-item" ng-click="file_modal(files)"><i class="fa-regular fa-pen-to-square me-2"></i> Rename</a>
                                    </li> 
                                    <li> 
                                        <a class="dropdown-item" ng-click="share_modal(files, 0)"><i class="fa-regular fa-share-from-square me-2"></i> Share</a>
                                    </li> 
                                    <li> 
                                        <a class="dropdown-item" ng-click="remove_files(files)"><i class="fa-regular fa-trash me-2"></i> Remove</a>
                                    </li> 
                                </ul>
                            </div>
                        </div> 
                </div>
            </div>
        </div>  
    </div>
        <div class="row mt-5">
        <div class="col-lg-12 mb-2">
            <h5 class="fw-bold"> Recent Files</h5>
            <small>Date: {{todayDate}}</small>
        </div> 
        <!-- image -->
        <div class="col-lg-12">
            <div class="table-in">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="fw-semibold" >Name</th>
                            <th class="fw-semibold" width="10%">Size</th>
                            <th class="fw-semibold" width="10%">Type</th>
                            <th class="fw-semibold" width="10%">Last Modified</th> 
                        </tr>
                    </thead>
                    <tbody>
                         <tr ng-repeat="files in filtered = (rfobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.file_name}}</td>
                            <td>{{formatSize(files.file_size)? formatSize(files.file_size) : 0}}</td> 
                            <td>{{files.file_type}}</td>
                            <td>{{files.last_modified | date: 'MMM dd, yyyy hh:mm a'}}</td> 
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