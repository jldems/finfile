<!DOCTYPE html>
<html lang="en" ng-app="app">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finfile</title>
    <link rel="stylesheet" href="src/style.css">
    <link rel="stylesheet" href="modules/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="modules/fontawesome2/css/all.min.css">
    <link rel="stylesheet" href="modules/boxicons/css/boxicons.min.css">
    <link rel="stylesheet" href="modules/sweetalert/sweetalert2.min.css">
    <link rel="stylesheet" href="modules/toaster/toast.css">
    <link rel="stylesheet" href="modules/ngTags/ng-tags-input.min.css">
    <link rel="stylesheet" href="modules/angular-dropdown/dropdown-select.css">
    <link rel="shortcut icon" href="favicon.svg" type="image/x-icon">
    <link rel="stylesheet" href="modules/dropdown-select/select2.min.css" />

    <script id="uib/template/pagination/pagination.html" type="text/ng-template">
        <li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="page-item"><a href ng-click="selectPage(1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle class="page-link"><i class="fa-solid fa-angle-left me-2"></i>First</a></li>
        <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="page-item"><a href ng-click="selectPage(page - 1, $event)" ng-disabled="noPrevious()||ngDisabled" uib-tabindex-toggle class="page-link"><i class="fa-solid fa-angle-left me-2"></i>Previous</a></li>
        <li role="menuitem" ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="page-item page-num"><a href ng-click="selectPage(page.number, $event)" ng-disabled="ngDisabled&&!page.active" uib-tabindex-toggle class="page-link">{{page.text}}</a></li>
        <li role="menuitem" ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="page-item"><a href ng-click="selectPage(page + 1, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle class="page-link">Next<i class="fa-solid fa-angle-right ms-2"></i></a></li>
        <li role="menuitem" ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="page-item"><a href ng-click="selectPage(totalPages, $event)" ng-disabled="noNext()||ngDisabled" uib-tabindex-toggle class="page-link">Last<i class="fa-solid fa-angle-right ms-2"></i></a></li>
    </script>
</head>

<body> 
    <div ui-view></div>
</body>
<!-- main components libraries -->
<script src="modules/jquery/jquery.min.js"></script>
<script src="modules/bootstrap/js/bootstrap.bundle.js"></script>
<script src="modules/sweetalert/sweetalert2.all.min.js"></script>
<script src="modules/mousetrap.js"></script>
<script src="modules/toaster/toast.js"></script>
<script src="modules/wysihtml/dist/wysihtml-toolbar.min.js"></script>
<script src="modules/wysihtml/parser_rules/advanced_and_extended.js"></script>
<script src="modules/pdf/html2canvas.js"></script>
<script src="modules/pdf/jspdf.umd.min.js"></script>
<script src="modules/pdf/html2pdf.js"></script>
<script src="modules/xlsx.full.min.js"></script>
<script src="modules/apexcharts.js"></script>
<script src="modules/exceljs/package/dist/exceljs.min.js"></script>
<script src="modules/dropdown-select/select2.min.js"></script>


<!-- angularjs modules and libraries -->
<script src="modules/angular/angular.min.js"></script>
<script src="modules/angular/angular-filter.js"></script>
<script src="modules/angular/angular-idle.min.js"></script>
<script src="modules/angular-sanitize/angular-sanitize.min.js"></script>
<script src="modules/angular-animate/angular-animate.min.js"></script>
<script src="modules/@uirouter/angularjs/release/angular-ui-router.min.js"></script>
<script src="modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js"></script>
<script src="modules/angularjs-sweetalert2/SweetAlert2.min.js"></script>
<script src="modules/printjs/print.min.js"></script>
<script src="modules/ngTags/ng-tags-input.min.js"></script>
<script src="modules/qrcode.min.js"></script>
<script src="modules/angular-qrcode.js"></script>
<script src="modules/file-saver.js"></script>
<script src="modules/aes.js"></script>
<script src="modules/ocLazyLoad.min.js"></script>

<!-- application script files -->
<script src="src/app.js"></script>

<!-- directives -->
<script src="src/directives/number-only.js"></script> 
<script src="src/directives/date-input.js"></script> 
<script src="src/directives/dropdown-select.js"></script>

<!-- services --> 
<script src="src/services/api.route.js"></script>
<script src="src/services/decrypter.js"></script>
<script src="src/controllers/ngcontroller.js"></script> 

</html>