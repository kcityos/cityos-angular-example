var dataVis = angular.module('dataVis', ['ngWebSocket']);

dataVis.factory('IncomingData', function($websocket) {
  var ws = $websocket('ws://localhost:9090');

  var collection = [];

  ws.onOpen(function (event) {
    console.log('Hurrah! Connected to the WebSocket server!');
  });

  ws.onMessage(function(event) {
    console.log('The server told us: %o', event.data);
    collection.push(event.data);
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
});
