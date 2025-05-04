<div class="vh-100 d-flex align-items-center justify-content-center flex-column">
    <div class="login-form">
        <div class="login-title pt-4 mt-2 pb-4">
            <div class="d-flex align-items-center justify-content-center">
                <img src="src/assets/images/logo.svg" alt="">
                <div class="ms-2">
                    <h5 class="mb-0">FinFile</h5> 
                </div>
            </div>
        </div>
        <form ng-submit="login_user(users)" class="pt-3 pb-4 mb-3 px-4 mx-2">
            <div class="input-form-grp mb-3">
                <i class="fa-regular fa-id-badge me-2"></i>
                <input type="text" placeholder="Username" ng-model="users.username" style="background-color: #FFF; color: var(--sec-color-3)">
            </div>
            <div class="input-form-grp mb-3">
                <i class="fa-regular fa-lock me-2"></i>
                <input type="password" placeholder="Password" ng-model="users.password" style="background-color: #FFF; color: var(--sec-color-3)">
            </div>
            <div class="col-auto">
                <button class="btn btn-ff-primary px-4">
                    LOGIN 
                </button>
                <button class="btn btn-ff-sec px-4">
                    SIGN UP 
                </button>
            </div>
            <div class="alert alert-danger mt-3" role="alert" ng-if="msg !=''">
                <i class="fa-regular fa-triangle-exclamation me-2 text-dark"></i>
                {{msg}}
            </div>
        </form>
    </div>
</div>