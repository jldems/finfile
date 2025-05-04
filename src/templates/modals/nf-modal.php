<div class="modal-body">
    <div class="row"> 
        <div class="col-lg-12 mb-3">
            <h5 class="text-dark modal-title">{{modaltitle}}</h5>
        </div>
        <div class="col-lg-12 mb-3"> 
            <input type="text" class="input-form" placeholder="Untitled Folder" ng-model="foldername"  >
        </div> 
        <div class="col-lg-12 text-end">
            <a type="button" class="text-danger me-3" ng-click="closeModal()">Cancel</a>
            <a class="text-dark modal-trig-btn" ng-click="modalval == 0? update_folder(foldername, folderlist) : new_folder(foldername)">{{modaltrigbtn}}</a> 
        </div>
    </div>
</div> 