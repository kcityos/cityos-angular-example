var dataVis = angular.module('dataVis', ['ngWebSocket']);
var chart;

dataVis.factory('IncomingData', function($websocket) {
  var ws = $websocket('ws://localhost:9090');

  var collection = [];

  ws.onOpen(function (event) {
    console.log('Hurrah! Connected to the WebSocket server!');
  });

  ws.onMessage(function(event) {
    console.log('The server told us: %o', event.data);
    var data = Number(event.data);
    collection.push(data);
  });

  ws.onError(function (event) {
    console.log('Ouch :(');
  });

  ws.onClose(function (event) {
    console.log('Server closed the connection. What to do now?');
  });

  var object = {
    collection: collection
  };

  return object;
});

dataVis.controller('ListController', function($scope, IncomingData) {
  $scope.data = IncomingData.collection;

  $scope.$watchCollection('data', function(newData) {
    if (chart) {
      // Highcharts has a nasty habit of mutating arrays given to it, so we'll give it a copy
      newData = newData.slice(Math.max(0, newData.length - 15));
      chart.series[0].setData(newData);
    }
  });
});

$(function() {
  chart = new Highcharts.Chart({
    chart: {
      type: 'column',
      renderTo: 'chart'
    },
    title: {
      text: 'Flux Capacitor Oscillations per Second'
    },
    xAxis: {
      title: {
        text: 'Second'
      }
    },
    yAxis: {
      title: {
        text: 'Oscillations per Second'
      }
    },
    series: [{ data: [] }]
  });

  $('#chartType').on('change', function() {
    var type = $('#chartType').val();
    chart.series[0].update({ type: type });
  });
});
