app.factory("$rest", function ($http) {
  var obj = {};
  obj.post = function (url, arr) {
    return $http.post(`api/${url}`, arr, {
      responseType: "json",
      cache: true,
    });
  };
  obj.get = function (url) {
    return $http.get(`api/${url}`);
  };

  return obj;
});
