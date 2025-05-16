<div class="sidebar" id="sidebar" >
    <div class="sidebar-header">
        <div class="d-flex align-items-center justify-content-center">
            <img src="src/assets/images/logo.svg" alt="">
            <div class="ms-2">
                <h5 class="mb-0">FinFile</h5>
            </div>
        </div>
    </div>
    <ul>
        <li>
            <div class="mb-2">Overview</div>
            <a ui-sref-active="active-menu" ui-sref="app.overview">
                <i class="fa-solid fa-grid-2 me-3"></i>
                <span>Overview Files</span>
            </a>
        </li> 
    </ul>
    <ul> 
        <li>
            <div class="mb-2">File Manager</div>
            <a ui-sref-active="active-menu" ui-sref="app.myfiles">
                <i class="fa-regular fa-files me-3"></i>
                <span>My Files</span>
            </a> 
            <a ui-sref-active="active-menu" ui-sref="app.recent_uploads" class="d-flex align-items-center">
                <i class="fa-solid fa-timer me-3"></i>
                <div class="d-flex align-items-center justify-content-between w-100">
                    <span>Recent Uploads</span>
                    <span class="badge sidebar-badge" ng-if="todayUploadCount > 0">{{todayUploadCount}}</span>
                </div>
            </a>
            <a ui-sref-active="active-menu" ui-sref="app.favorites" class="d-flex align-items-center">
                <i class="fa-regular fa-star me-3"></i> 
                <div class="d-flex align-items-center justify-content-between w-100">
                    <span>Favorites</span>
                    <span class="badge sidebar-badge" ng-if="todayFavCount > 0">{{todayFavCount}}</span>
                </div>
            </a>
            <a ui-sref-active="active-menu" ui-sref="app.trash">
                <i class="fa-regular fa-trash-can me-3"></i>
                <span>Trash</span>
            </a>
        </li>  
    </ul>
    <ul> 
        <li>
            <div class="mb-2">Shared Files</div>
            <a ui-sref-active="active-menu" ui-sref="app.sharedfolder">
                <i class="fa-regular fa-folder-minus me-3"></i>
                <span>Shared Folder</span>
            </a>
            <a ui-sref-active="active-menu" ui-sref="app.sharedfiles">
                <i class="fa-regular fa-file-lines me-3"></i>
                <span>Shared File</span>
            </a> 
        </li>  
    </ul>
    <ul> 
        <li>
            <div class="mb-2">Team Folder</div>
            <a ng-repeat="team in teamobj" ng-click="team_open(team)">
                <i class="fa-regular fa-folder-minus me-3"></i>
                <span>{{team.team_name}}</span>
            </a> 
        </li>  
        <li>
            <button type="button"  class="btn btn-ff-primary-5" ng-click="team_modal(1)"><i class="fa-regular fa-plus me-3"></i> Add team folder</button>
        </li>  
    </ul>
    <ul>  
        <li>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div><i class="fa-solid fa-hard-drive me-2"></i> Storage</div>
                <div>{{usagePercent}}%</div>
            </div>
            <div class="progress custom-progress" role="progressbar" aria-label="Disk usage"
                aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{usagePercent}}">
                <div class="progress-bar custom-progress-bar"
                    ng-class="{'bg-danger': usagePercent >= 85, 'bg-warning': usagePercent >= 60 && usagePercent < 85, 'bg-success': usagePercent < 60}"
                    ng-style="{'width': usagePercent + '%'}">
                </div>
            </div>
        </li>
    </ul>
</div>