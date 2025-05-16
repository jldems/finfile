<div id="DontPrint" class="topbar d-flex align-items-center justify-content-between position-sticky top-0" id="DontPrint">
    <div class="container-fluid d-flex">
        <button class="btn btn-theme-dark rounded px-3" ng-click="toggleMenu()">
            <i class="fa-solid fa-grip-vertical text-white fa-xl"></i>
        </button>
    </div>
    <div class="container-fluid">
       <div class="d-flex align-items-center justify-content-end gap-3">
            <!-- logs -->
            <div class="dropdown position-relative">
                <button class="btn p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-regular fa-circle-info fa-xl"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end mt-4 py-3 px-3" style="min-width: 250px;">
                    <li >
                        <span class="text-dark fw-semibold d-block mb-2"><i class="fa-solid fa-circle-info text-dark"></i> File Access Logs</span>
                    </li>
                    <div class="dropdown-divider"></div> 
                    <li ng-repeat="log in falobj" ng-if="falobj.length > 0">
                        <div class="d-flex align-items-center gap-3 py-3 p-0">
                             <i class="fas fa-file-alt text-dark fa-lg"></i>
                            <div>
                                <div class="text-dark fw-medium">{{log.remarks}}</div>
                                <small class="text-muted">{{log.logsdate | date: 'MMM dd, yyyy hh:mm a'}}</small>
                            </div>
                        </div>
                    </li>

                    <!-- Show "no access logs" if empty -->
                    <li ng-if="falobj.length === 0" class="text-muted text-center py-3">
                        No access logs available.
                    </li>
                    <div class="dropdown-divider"></div>
                    <li>
                         <small class="fst-normal pt-4" style="cursor:pointer; color: #ff6913;">See All Logs</small>   
                    </li>
                </ul>
            </div>
            <!-- notification -->
            <div class="dropdown position-relative">
                <button class="btn p-2 position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                    <i class="fa-regular fa-bell fa-xl"></i>
                    <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" ng-if="ntfsobj.length > 0"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end mt-4 py-3 px-3" style="min-width: 250px;">
                    <li class="d-flex align-items-center justify-content-between">
                        <span class="text-dark fw-semibold d-block mb-2"><i class="fa-solid fa-bell text-dark"></i> Notifications</span>
                        <small class="text-dark fw-semibold d-block mb-2" type="button" ng-click="mark_as_read(ntfsobj)">Mark as Read</small>
                    </li>
                    <div class="dropdown-divider"></div>
                    <li ng-repeat="ntfs in ntfsobj" ng-if="ntfsobj.length > 0">
                        <div class="d-flex align-items-center gap-3 py-3 p-0">
                            <i class="fa-solid fa-envelope text-dark fa-lg" ng-show="ntfs.is_read == 0"></i>
                            <i class="fa-solid fa-envelope-open text-dark fa-lg" ng-show="ntfs.is_read == 1"></i>
                            <div>
                                <div class="text-dark fw-medium">{{ntfs.title}} by {{ntfs.sendername}}</div>
                                <small class="text-muted">{{ntfs.created_at | date: 'MMM dd, yyyy hh:mm a'}}</small>
                            </div>
                        </div>
                    </li>  
                    <li ng-if="ntfsobj.length === 0" class="text-muted text-center py-3">
                        No notification available.
                    </li>
                    <div class="dropdown-divider"></div>
                    <li>
                         <small class="fst-normal pt-4" style="cursor:pointer; color: #ff6913;">See All Notifications</small>   
                    </li>
                </ul>
            </div> 
            <div class="profile dropdown-toggle">
                <button class="btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="{{info.avatar || src/assets/images/profile-picture.png}}" alt="avatar" onerror="this.onerror=null;this.src='src/assets/images/profile-picture.png'">  
                </button>
                <div class="dropdown-menu dropdown-menu-right"> 
                    <div class="user-box">
                        <img src="{{info.avatar || src/assets/images/profile-picture.png}}" alt="avatar" onerror="this.onerror=null;this.src='src/assets/images/profile-picture.png'">
                        <div class="ms-2">
                            <div class="fw-bold mb-0 text-black">{{info.fullname}}</div>
                            <small class="text-black">{{info.email}}</small>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" type="button" ui-sref="app.profile">
                        <i class="fa-regular fa-user me-3"></i>
                        Profile
                    </button> 
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" type="button" ui-sref="app.lognotif">
                        <i class="far fa-bells me-3"></i>
                        Log & Notification Center
                    </button> 
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" type="button" ng-click="logout_user()">
                        <i class="fa-solid fa-arrow-right-from-bracket me-3"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 