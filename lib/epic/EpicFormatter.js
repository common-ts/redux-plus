"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EpicFormatter = (function () {
  function EpicFormatter() {
  }
  EpicFormatter.formatEpicComponents = function (epicComponents) {
    var arrResult = [];
    if (epicComponents) {
      epicComponents.forEach(function (element) {
        var actionKeys = Object.keys(element);
        for (var _i = 0, actionKeys_1 = actionKeys; _i < actionKeys_1.length; _i++) {
          var key = actionKeys_1[_i];
          arrResult.push(element[key]);
        }
      });
    }
    return arrResult;
  };
  return EpicFormatter;
}());
exports.EpicFormatter = EpicFormatter;
