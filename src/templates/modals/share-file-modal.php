<div class="modal-body">
    <div class="row"> 
        <div class="col-lg-12 mb-3">
            <h5 class="text-dark modal-title">Share {{sharefileobj.file_name}}</h5>
        </div>
        <div class="col-lg-12 mb-3"> 
            <select class="input-form" ng-model="usershare" multiple dropdown-select placeholder="Select person to share"> 
                <option ng-repeat="user in userobj" ng-value="user.user_id">{{user.full_name}}</option>
            </select>
        </div> 
        <div class="col-lg-12 mb-3">
            <h6 class="text-dark modal-title">Owner</h6>
            <div class="text-dark">{{sharefileobj.file_owner}}</div>
        </div>
        <div class="col-lg-12 mb-3">
            <h6 class="text-dark modal-title">Permission</h6>
            <select class="input-form" ng-model="permission">
                <option value="">Select Permission</option>
                <option value="view">View</option>
                <option value="edit">Edit</option>
            </select>
        </div>
        <div class="col-lg-12 text-end">
            <a type="button" class="text-danger me-3" ng-click="closeModal()">Cancel</a>
            <a class="text-dark modal-trig-btn" ng-click="share_files(usershare, permission, sharefileobj)">Share</a> 
        </div>
    </div>
</div> 