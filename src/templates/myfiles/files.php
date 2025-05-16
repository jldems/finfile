
<div class="row"> 
    <div class="col-lg-12">
        <div class="table-in">
            <table class="table align-middle">
                <thead>
                    <tr> 
                        <th class="fw-semibold" >Name</th>
                        <th class="fw-semibold" width="10%">Type</th> 
                        <th class="fw-semibold" width="10%">Size</th> 
                        <th class="fw-semibold" width="10%">Last Modified</th>
                        <th class="fw-semibold text-center" width="10%">Last Update</th>
                        <th class="fw-semibold text-center" width="10%">Favorite</th>
                        <th class="fw-semibold text-center" width="1%" nowrap>Option</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="files in filtered = (fileobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                        <td>{{files.file_name}}</td>
                        <td>{{files.file_type}}</td>
                        <td>{{formatSize(files.file_size)? formatSize(files.file_size) : 0}}</td> 
                        <td>{{files.last_modified | date: 'MMM dd, yyyy hh:mm a'}}</td>
                        <td class="text-center">{{files.last_updated_by}}</td>
                        <td class="text-center"><div type="button" ng-click="is_favorite(files)"><i ng-if="files.is_favorite == 0" class="fa-regular fa-star"></i><i ng-if="files.is_favorite == 1" class="fa-solid fa-star"></i></div></td>
                        <td class="text-center">
                            <div class="d-flex align-items-center justify-content-center">
                                <div class="dropdown btn-dropdown">
                                    <button class="btn btn-ff-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-regular fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li ng-if="files.file_type == 'pdf'"> 
                                            <a class="dropdown-item" ng-click="view_files(files)"><i class="fa-regular fa-download me-2"></i> View</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="download_files(files)"><i class="fa-regular fa-download me-2"></i> Download</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="file_modal(files)"><i class="fa-regular fa-pen-to-square me-2"></i> Rename</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="share_modal(files, 0 )"><i class="fa-regular fa-share-from-square me-2"></i> Share</a>
                                        </li> 
                                        <li> 
                                            <a class="dropdown-item" ng-click="remove_files(files)"><i class="fa-regular fa-trash me-2"></i> Remove</a>
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