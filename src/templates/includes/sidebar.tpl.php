<div class="sidebar" id="sidebar">
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
                <span>Overview Storage</span>
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
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-solid fa-timer me-3"></i>
                <span>Recent Uploads</span>
            </a>
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-regular fa-star me-3"></i>
                <span>Favorites</span>
            </a>
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-regular fa-trash-can me-3"></i>
                <span>Trash</span>
            </a>
        </li>  
    </ul>
    <ul> 
        <li>
            <div class="mb-2">Shared Files</div>
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-regular fa-folder-minus me-3"></i>
                <span>Shared Folder</span>
            </a>
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-regular fa-file-lines me-3"></i>
                <span>Shared File</span>
            </a> 
        </li>  
    </ul>
    <ul> 
        <li>
            <div class="mb-2">Team Storage</div>
            <a ui-sref-active="active-menu" ui-sref="storage">
                <i class="fa-regular fa-folder-minus me-3"></i>
                <span>Sample Team</span>
            </a> 
        </li>  
        <li>
            <button type="button"  class="btn btn-ff-primary-5"><i class="fa-regular fa-plus me-3"></i> Add team storage</button>
        </li>  
    </ul>
    <ul> 
        <li>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div><i class="fa-solid fa-hard-drive  me-2"></i> Storage</div>
                <div>92%</div>
            </div>
            <div class="progress custom-progress" role="progressbar" aria-label="Basic example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar custom-progress-bar orange" style="width: 92%;"></div>
            </div>
        </li>  
    </ul>
</div>