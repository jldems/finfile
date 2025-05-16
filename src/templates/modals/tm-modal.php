<div class="modal-body">
    <div class="row"> 
        <div class="col-lg-12 mb-3">
            <h5 class="text-dark modal-title">{{modaltitle}}</h5>
        </div>
        <div class="col-lg-12 mb-3"> 
            <select class="input-form" ng-model="teammember" multiple dropdown-select placeholder="Select team members"> 
                <option ng-repeat="user in userobj" ng-value="user.user_id">{{user.full_name}}</option>
            </select>
        </div> 
        <div class="col-lg-12 mb-3"> 
            <input type="text" class="input-form" placeholder="Untitled Team Folder" ng-model="teamfoldername"  >
        </div> 
        <div class="col-lg-12 text-end">
            <a type="button" class="text-danger me-3" ng-click="closeModal()">Cancel</a>
            <a class="text-dark modal-trig-btn" ng-click="modalval == 0? update_teamfolder(teamfoldername, teammember) : create_teamfolder(teamfoldername, teammember)">{{modaltrigbtn}}</a> 
        </div>
    </div>
</div> 