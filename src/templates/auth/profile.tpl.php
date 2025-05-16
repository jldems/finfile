
<div class="container-fluid py-4 px-4">
    <!-- filtered and top-->
    <div class="row mb-2 align-items-center">
        <div class="col-lg-8">
            <h6 class="text-theme-dark fw-bold mb-0" ng-click="navigateto('app.myfiles')" type="button"><i class="fa-regular fa-user me-2"></i> Profile</h6>
        </div> 
    </div> 
    <div class="row mt-5"> 
        <div class="col-lg-4"> 
            <div class="card " style="background-color: var(--sec-color);"> 
                <div class="card-body py-5">
                    <div class="item-img">
                        <img ng-src="{{prfl.avatar}}" alt="avatar">
                    </div>
                    <div class="text-center mt-4">
                        <h3>{{prfl.fullname}}</h3>
                        
                    </div>
                    <div class="text-center my-4">
                        <h5>{{prfl.email}}</h5>
                    </div>
                    <hr>
                    <div class="d-flex align-items-center justify-content-evenly pt-4">
                        <input type="file" style="display:none" id="pimg" 
                        accept="image/*" 
                        onchange="angular.element(this).scope().avatar_change(this)">
                        <label for="pimg"  style="cursor:pointer; color: #ff6913;">
                            Browse
                        </label>
                        <div type="button" class="text-danger" ng-click="remove_avatar(prfl)">
                            Remove
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-8"> 
            <div class="card" style="background-color: var(--sec-color);"> 
                <div class="card-body px-5 py-4">
                    <table class="table align-middle table-borderless"> 
                        <tbody>
                            <tr>
                                <td class="fs-5">Full Name:  <input type="text" class="table-input w-50 fs-5" ng-model="prfl.fullname"></td>
                            </tr>
                            <tr>
                                <td class="fs-5">Email:  <input type="text" class="table-input w-50 fs-5" ng-model="prfl.email"></td> 
                            </tr>
                            <tr>
                                <td class="fs-5">Date Created: {{prfl.createdat}}</td> 
                            </tr>
                        </tbody>
                    </table> 
                    <table class="table align-middle table-borderless"> 
                        <tbody>
                            <tr>
                                <td class="fs-5">Username:  <input type="text" class="table-input w-50 fs-5" ng-model="prfl.username"></td> 
                            </tr> 
                            <tr>
                                <td class="fs-5">Password:  <input type="password" class="table-input w-50 fs-5" ng-model="prfl.password"></td> 
                            </tr>
                            <tr>
                                <td class="fs-5">Confirm Password:  <input type="text" class="table-input w-50 fs-5" ng-model="prfl.confirmpassword" placeholder="Confirm Password"></td> 
                            </tr>
                            <tr>
                                <td class="fs-5">New Password:  <input type="text" class="table-input w-50 fs-5" ng-model="prfl.newpassword" placeholder="New Password"></td> 
                            </tr>
                        </tbody>
                    </table> 
                    <div type="button" class="py-4" ng-click="update_profile(prfl)" style="color: #ff6913;">
                        Update Profile
                    </div>
                </div>
            </div>
        </div>
    </div> 
</div>