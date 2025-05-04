<div id="DontPrint" class="topbar d-flex align-items-center justify-content-between position-sticky top-0" id="DontPrint" ng-controller="ngController">
    <div class="container-fluid d-flex">
        <button class="btn btn-theme-dark rounded px-3" ng-click="toggleMenu()">
            <i class="fa-solid fa-grip-vertical text-white fa-xl"></i>
        </button>
    </div>
    <div class="container-fluid">
       <div class="d-flex align-items-center justify-content-end">
            <div>
                <button class="btn p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-regular fa-circle-info fa-xl"></i>
                </button>
            </div>
            <div class="dropdown">
                <button class="btn p-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-regular fa-bell fa-xl"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                    <span class="dropdown-item fw-bold text-decoration-none disabled">Inventory</span>
                    </li>
                    <li>
                    <button class="dropdown-item pt-2" type="button" ng-click="goto('inventory_report')">Inventory Ledger</button>
                    <button class="dropdown-item pt-2" type="button" ng-click="goto('stock_consumed')">Stock Consumed</button>
                    <button class="dropdown-item pt-2" type="button" ng-click="goto('batchreport')">Batch Report</button>
                    </li>
                    <li>
                    <span class="dropdown-item fw-bold text-decoration-none disabled">Sales</span>
                    </li>
                    <li>
                    <button class="dropdown-item pt-2" type="button" ng-click="goto('psreport')">Product Sales Report</button>
                    </li>
                </ul>
            </div>
            <div class="profile dropdown-toggle">
                <button class="btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="src/assets/images/profile-picture.png" alt="profile" onerror="this.onerror=null;this.src='src/assets/images/profile-picture.png'">  
                </button>
                <div class="dropdown-menu dropdown-menu-right"> 
                    <div class="user-box">
                        <img src="src/assets/images/profile-picture.png" alt="profile" onerror="this.onerror=null;this.src='favicon.png'">
                        <div class="ms-2">
                            <div class="fw-bold mb-0 text-black">{{info.fullname}}</div>
                            <small class="text-black">{{info.email}}</small>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" type="button" >
                        <i class="fa-regular fa-user me-3"></i>
                        Profile
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