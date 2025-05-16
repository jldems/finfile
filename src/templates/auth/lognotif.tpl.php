
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0" ng-click="navigateto('app.myfiles')" type="button"><i class="far fa-bells me-2"></i>
            Log & Notification Center</h6>
        </div> 
    </div> 
    <div class="row mt-5"> 
        <div class="col-lg-12 mb-4">
            <div class="d-flex align-items-center justify-content-between">
                <h5 class="fw-bold"> File access logs</h5> 
                <button class="btn btn-ff-primary" tooltip="Remove all logs" flow="down" ng-click="create_modal(1)">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
            <div class="input-form-grp-search w-25">
                <input type="text" placeholder="Search..." ng-model="logsearch">
                <i class="fa-solid fa-search"></i>
            </div>
        </div> 
        <div class="col-lg-12"> 
            <div class="table-in">
                <table class="table align-middle">
                    <thead>
                        <tr> 
                            <th class="fw-semibold" >LogID</th>
                            <th class="fw-semibold" >Message</th>
                            <th class="fw-semibold" width="12%">Type</th> 
                            <th class="fw-semibold" width="12%">Actions</th> 
                            <th class="fw-semibold" width="12%">Logs Date</th>   
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="files in filteredx = (logsobj) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{files.log_id}}</td>
                            <td>{{files.remarks}}</td>
                            <td>{{files.types}}</td> 
                            <td>{{files.actions}}</td>
                            <td>{{files.logsdate | date: 'MMM dd, yyyy hh:mm a'}}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex align-items-center justify-content-end pt-3">
                <ul style="margin-bottom: 0 !important;" uib-pagination total-items="filteredx.length" num-pages="numPages" items-per-page="items_per_page" ng-model="current_page" max-size="5" boundary-link-numbers="true" ng-change="pageChanged()"></ul>
            </div>
        </div>
        <hr class="my-5">
        <div class="col-lg-12 mb-4"> 
            <div class="d-flex align-items-center justify-content-between">
                <h5 class="fw-bold"> Notification</h5> 
                <button class="btn btn-ff-primary" tooltip="Remove all logs" flow="down" ng-click="create_modal(1)">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
            <div class="input-form-grp-search w-25">
                <input type="text" placeholder="Search..." ng-model="notifsearch">
                <i class="fa-solid fa-search"></i>
            </div>
        </div>
        <div class="col-lg-12"> 
            <div class="table-in">
                <table class="table align-middle">
                    <thead>
                        <tr> 
                            <th class="fw-semibold" >NotifID</th>
                            <th class="fw-semibold" width="12%">Title</th> 
                            <th class="fw-semibold" width="12%">Message</th> 
                            <th class="fw-semibold" width="12%">Type</th> 
                            <th class="fw-semibold" width="12%">Notif Date</th>  
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="notif in filteredi = (notifobj | filter: notifsearch) | limitTo:items_per_page:items_per_page*(current_page-1)">
                            <td>{{notif.ntfctns_id}}</td>
                            <td>{{notif.title}}</td>
                            <td>{{notif.messages}}</td> 
                            <td>{{notif.types}}</td> 
                            <td>{{notif.created_at | date: 'MMM dd, yyyy hh:mm a'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex align-items-center justify-content-end pt-3">
                <ul style="margin-bottom: 0 !important;" uib-pagination total-items="filteredi.length" num-pages="numPages" items-per-page="items_per_page" ng-model="current_page" max-size="5" boundary-link-numbers="true" ng-change="pageChanged()"></ul>
            </div>
        </div>
    </div> 
</div>