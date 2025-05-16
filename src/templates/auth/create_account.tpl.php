<div class="vh-100 d-flex align-items-center justify-content-center flex-column">
    <div class="login-form">
        <div class="login-title pt-4 mt-2 pb-4">
            <div class="d-flex align-items-center justify-content-center"> 
                <div class="ms-2">
                    <h5 class="mb-0">Create Account</h5> 
                </div>
            </div>
        </div>
        <form ng-submit="create_account(ca)" class="pt-3 pb-4 mb-3 px-4 mx-2">
            <div class="col-lg-12 mb-3">
                <div class="item-img">
                    <img ng-src="{{ca.avatar}}" alt="avatar">
                </div>
                <div class="d-flex align-items-center justify-content-evenly mb-4 mt-3">
                    <input type="file" style="display:none" id="pimg" 
                    accept="image/*" 
                    onchange="angular.element(this).scope().avatar_change(this)">
                    <label for="pimg" class="text-dark" style="cursor:pointer">
                        Browse
                    </label>
                    <div type="button" class="text-danger" ng-click="remove_img()">
                        Remove
                    </div>
                </div>
            </div>
            <hr>
            <div class="col-lg-12 mb-3">
                <label class="text-dark">Full Name <span class="text-danger">*</span></label>
                <input type="text" class="input-form" placeholder="Full name" ng-model="ca.fullname" ng-change="create_onchange(ca)" style="background-color: #FFF; color: var(--sec-color-3);">
            </div>
            <div class="col-lg-12 mb-3">
                <label class="text-dark">Email <span class="text-danger">*</span></label>
                <input type="text" class="input-form" placeholder="Email address" ng-model="ca.email" ng-change="create_onchange(ca)" style="background-color: #FFF; color: var(--sec-color-3);">
            </div>
            <div class="col-lg-12 mb-3">
                <label class="text-dark">User Name <span class="text-danger">*</span></label>
                <input type="text" class="input-form" placeholder="User name" ng-model="ca.username" ng-change="create_onchange(ca)" style="background-color: #FFF; color: var(--sec-color-3);">
            </div>
            <div class="col-lg-12 mb-3">
                <label class="text-dark">Password <span class="text-danger">*</span></label>
                <input type="text" class="input-form" placeholder="Password" ng-model="ca.password" ng-change="create_onchange(ca)" style="background-color: #FFF; color: var(--sec-color-3);">
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-ff-primary px-4">
                    CREATE NOW
                </button> 
                <button type="button" class="btn btn-ff-sec px-4" ui-sref="login">
                    LOGIN
                </button>
            </div> 
            <div class="alert alert-danger mt-3" role="alert" ng-if="msg !=''">
                <i class="fa-regular fa-triangle-exclamation me-2 text-dark"></i>
                {{msg}}
            </div>
        </form>
    </div>
</div>