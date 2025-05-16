<div class="modal-body">
    <div class="row"> 
        <div class="col-lg-12 mb-3">
            <h5 class="text-dark modal-title">Team Members</h5>
        </div> 
        <div class="col-lg-12 mb-3"> 
            <div class="d-flex align-items-center justify-content-center gap-3">
                <select class="input-form" ng-model="teammember" multiple dropdown-select placeholder="Select team members"> 
                    <option ng-repeat="user in userobj" ng-value="user.user_id">{{user.full_name}}</option>
                </select>
                <button class="btn btn-ff-primary" ng-click="team_add(teammember)" >Add</button>
            </div>
        </div> 
        <div class="col-lg-12 mb-3"> 
            <table class="table align-middle">
                <thead>
                    <tr> 
                        <th class="fw-semibold text-black" >Name</th>  
                        <th class="fw-semibold text-black" width="10%" nowrap>Added At</th>
                        <th class="fw-semibold text-center text-black" width="5%" nowrap>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="files in filtered = (tmmobj | filter: search) | limitTo:items_per_page:items_per_page*(current_page-1)">
                        <td class="text-black">{{files.teammname}}</td>  
                        <td class="text-black"  nowrap>{{files.added_at | date: 'MMM dd, yyyy hh:mm a'}}</td>   
                        <td class="text-center "> 
                            <a class="text-danger" ng-click="team_remove(files)"><i class="fa-regular fa-trash me-2 text-danger"></i></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> 
        <div class="col-lg-12 text-end">
            <a type="button" class="text-danger me-3" ng-click="closeModal()">Cancel</a> 
        </div>
    </div>
</div> 