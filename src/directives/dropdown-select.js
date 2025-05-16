app.directive("dropdownSelect", function ($timeout) {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      $timeout(function () {
        element.select2({
          allowClear: true,
          placeholder: attrs.placeholder
        });

        // Update Angular model when Select2 value changes
        element.on("change", function () {
          let selectedValue = element.val();
          scope.$applyAsync(function () {
            ngModel.$setViewValue(selectedValue);
          });
        });
      }, 0);
    },
  };
});
