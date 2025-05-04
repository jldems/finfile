angular
  .module("app")
  .controller("overview", function ($scope, $state, $filter, $rest) {
    document.title = "Overview | FinFile";
    /*   $scope.check_loggedIn = function () {
    let ff_user = localStorage.getItem("ff_user");
    if (ff_user) {
      $state.go("overview");
    } else {
      $state.go("login");
    }
  };
  $scope.check_loggedIn(); */
    $scope.todayDate = $filter("date")(new Date(), "MMM dd, yyyy");
    var date = new Date();
    date.setDate(date.getDate() - 7);
    $scope.startDate = date;
    $scope.endDate = new Date();

    $scope.xlabel = JSON.parse(localStorage.getItem("date_range_lbl"));
    $scope.inrange = "weekly";
    $scope.create = function () {
      console.log("asd");
    };
    // $scope.chartest = function (xlabel, ydata) {
    //   var options = {
    //     chart: {
    //       type: "bar",
    //       fontFamily: "Poppins, sans-serif",
    //       width: "100%",
    //     },
    //     plotOptions: {
    //       bar: {
    //         vertical: true,
    //       },
    //     },
    //     stroke: {
    //       width: 0,
    //     },
    //     series: [
    //       {
    //         name: "Request",
    //         data: [12, 13, 16, 18, 30, 19, 27],
    //       },
    //       {
    //         name: "Purchase",
    //         data: [21, 23, 36, 12, 10, 29, 17],
    //       },
    //       {
    //         name: "Receiving",
    //         data: [11, 33, 46, 22, 58, 79, 57],
    //       },
    //       {
    //         name: "Returned",
    //         data: [11, 11, 16, 32, 11, 10, 89],
    //       },
    //     ],
    //     xaxis: {
    //       categories: xlabel,
    //     },
    //     dataLabels: {
    //       enabled: false,
    //       textAnchor: "start",
    //     },

    //     colors: ["#f06125", "#02aa53", "#212529", "#0DCAF0"],
    //   };

    //   var chart = new ApexCharts(document.querySelector("#chart"), options);

    //   chart.render();
    // };
    // $scope.chartest($scope.xlabel, "");

    // $scope.on_change_filter = function (type_of) {
    //   let xdates = [];
    //   let xlbl = [];
    //   let ydata = [];
    //   let currentDate = new Date();
    //   if (type_of == "weekly") {
    //     for (var i = 0; i < 7; i++) {
    //       xdates.push($filter("date")(currentDate, "yyyy-MM-dd"));
    //       xlbl.push($filter("date")(currentDate, "MM/dd/yy"));
    //       currentDate.setDate(currentDate.getDate() - 1);
    //     }
    //     localStorage.setItem("date_range", JSON.stringify(xdates));
    //     localStorage.setItem("date_range_lbl", JSON.stringify(xlbl));
    //     $scope.chartest(xdates, ydata);
    //     console.log(xdates);
    //   }
    // };

    // $scope.on_change_filter("weekly");

    /*  $scope.state_go = function (url, params, value) {
    console.log(url, params, value);
    if (value == 0) {
      localStorage.setItem("gls_item_id", params);
      $state.go(url, {}, { reload: true });
    } else if (value == 1) {
      localStorage.setItem("gls_dr_id", params);
      $state.go(url, {}, { reload: true });
    } else {
      localStorage.setItem("gls_sr_id", params);
      $state.go(url, {}, { reload: true });
    }
  }; */
  });
