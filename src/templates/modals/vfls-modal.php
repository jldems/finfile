<div class="modal-body">
    <div class="row"> 
        <div class="col-lg-12 mb-3">
            <h5 class="text-dark modal-title">{{ selectedFile.file_name}} {{selectedFile.file_path}}</h5>
        </div>
         <div class="col-lg-12 mb-3 text-center">{{selectedFile.file_type}}
            <iframe ng-if="selectedFile.file_type === 'pdf'" ng-src="{{selectedFile.file_path}}" style="width:100%; height:500px;"></iframe>
            <div ng-if="selectedFile.file_type === 'doc'">Word documents require a viewer. <a ng-href="{{selectedFile.file_path}}" target="_blank">Download</a></div>
        </div>
        <div class="col-lg-12 text-end">
            <a type="button" class="text-danger me-3" ng-click="closeModal()">Cancel</a>
            <a class="text-dark modal-trig-btn" ng-click="update_files(flnameobj)">Update</a> 
        </div>
    </div>
</div> 