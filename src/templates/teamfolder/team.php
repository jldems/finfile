
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0"> 
            <i class="fa-regular fa-files me-2"></i> Team Folder </h6>
        </div>
        <div class="col-lg-4" ng-show="!folderdata.shared_by">
            <div class="d-flex align-items-end justify-content-end" style="gap:10px">  
                <button class="btn btn-ff-primary" ng-click="team_modal(1)">
                <i class="fa-solid fa-plus me-2"></i> New Team Folder
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
                            <th class="fw-semibold" width="10%">Size</th> 
                            <th class="fw-semibold" width="10%">Created At</th>  
                            <th class="fw-semibold text-center" width="10%">Members</th>  
                            <th class="fw-semibold text-center" width="5%" nowrap>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="files in filtered = (tmobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.team_name}}</td> 
                            <td>{{formatSize(files.team_size)? formatSize(files.team_size) : 0}}</td> 
                            <td>{{files.created_at | date: 'MMM dd, yyyy hh:mm a'}}</td>  
                            <td class="text-center"><div ng-click="team_members(files.team_id)" type="button"><i class="fas fa-user-friends"></i></div></td>  
                            <td class="text-center">
                                <div class="d-flex justify-content-center">
                                    <div class="dropdown btn-dropdown">
                                        <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-regular fa-ellipsis-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu"> 
                                            <li>
                                                <a class="dropdown-item" ng-click="team_open(files)"><i class="fa-regular fa-file-arrow-up me-2"></i> Open</a>
                                            </li>
                                            <li> 
                                                <a class="dropdown-item" ng-click="download_folder(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                            </li> 
                                            <li> 
                                                <a class="dropdown-item" ng-click="rename_folder(files)" ng-show="!folderdata.shared_by"><i class="fa-regular fa-pen-to-square me-2"></i> Rename</a>
                                            </li>  
                                            <li> 
                                                <a class="dropdown-item" ng-click="remove_folder(files)" ng-show="!folderdata.shared_by"><i class="fa-regular fa-trash me-2"></i> Remove</a>
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