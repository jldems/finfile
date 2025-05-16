
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0" ng-click="navigateto('app.myfiles')" type="button"><i class="fa-regular fa-file-lines me-2"></i> Shared Files <span ng-show="folderdata"><i class="fa-solid fa-angle-right me-1"></i>{{folderdata.category_name}}</span></h6>
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
                                ng-class="typeval ? 'btn-ff-primary' : 'btn-ff-sec'"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ typeval || 'Type' }}
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" ng-click="typefilter('PDF')"><i class="fa-regular fa-file-pdf me-2"></i> PDF</a></li>
                                <li><a class="dropdown-item" ng-click="typefilter('Docs')"><i class="fa-regular fa-file me-2"></i> Docs</a></li> 
                                <li><a class="dropdown-item" ng-click="typefilter('Img')"><i class="fa-regular fa-image me-2"></i> Image</a></li> 
                                <li><a class="dropdown-item" ng-click="typefilter('Excel')"><i class="fa-regular fa-file-excel me-2"></i> Excel</a></li> 
                                <li><a class="dropdown-item" ng-click="flfilter('Txt')"><i class="fa-solid fa-file-pen me-2"></i> Txt</a></li>
                            </ul>
                        </div>
                        <button class="btn btn-danger" ng-if="typeval" ng-click="typefilter(null)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="d-flex align-items-center gap-1 filter-dropdown"> 
                        <div class="btn-group">
                            <button class="btn btn-ff-sec dropdown-toggle"
                                ng-class="flval ? 'btn-ff-primary' : 'btn-ff-sec'"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {{ flval || 'People' }}
                            </button>
                            <ul class="dropdown-menu">
                                <li ng-repeat="uo in userobj">
                                    <a class="dropdown-item" ng-click="flfilter(uo)">{{uo.full_name}}</a>
                                </li> 
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
                            <th class="fw-semibold" width="12%">Type</th> 
                            <th class="fw-semibold" width="12%">Shared By</th> 
                            <th class="fw-semibold" width="12%">Shared Date</th>  
                            <th class="fw-semibold text-center" width="10%">Favorite</th>
                            <th class="fw-semibold text-center" width="1%" nowrap>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="files in filtered = (shfilesobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.file_name}}</td>
                            <td>{{files.file_type}}</td>
                            <td>{{files.shared_by_name}}</td> 
                            <td>{{files.shared_at | date: 'MMM dd, yyyy hh:mm a'}}</td>
                            <td class="text-center"><div type="button" ng-click="is_favorite(files, 'shared')"><i ng-if="files.is_favorite == 0" class="fa-regular fa-star"></i><i ng-if="files.is_favorite == 1" class="fa-solid fa-star"></i></div></td>
                            <td class="text-center">
                                <div class="d-flex align-items-center justify-content-center">
                                    <div class="dropdown btn-dropdown">
                                        <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-regular fa-ellipsis-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu">  
                                            <li> 
                                                <a class="dropdown-item" ng-click="sf_download(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                            </li> 
                                            <li ng-if="files.permission == 'Edit'"> 
                                                <a class="dropdown-item" ng-click="file_modal(files)"><i class="fa-regular fa-pen-to-square me-2"></i> Rename</a>
                                            </li>  
                                            <li> 
                                                <a class="dropdown-item" ng-click="sf_remove(files)"><i class="fa-regular fa-trash me-2"></i> Remove</a>
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