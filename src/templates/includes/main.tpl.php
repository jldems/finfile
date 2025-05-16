<div class="d-flex" ng-controller="ngController">
  <div ng-include="'src/templates/includes/sidebar.tpl.php'"></div>
  <div class="content main-content" id="content">
    <div ng-include="'src/templates/includes/header.tpl.php'"></div>
    <div ui-view></div>
  </div>
</div>