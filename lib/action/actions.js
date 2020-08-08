"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var GlobalStateActionType_1 = require("./GlobalStateActionType");
var updateGlobalState_1 = require("./updateGlobalState");
function createAction(d){
  return d;
}
exports.initData = function(jsonObject){ return createAction({
  type: GlobalStateActionType_1.GlobalStateActionType.INIT_DATA,
  payload: jsonObject
}); };
exports.actionsGlobalState = {
  initData: exports.initData,
  updateGlobalState: updateGlobalState_1.updateGlobalState
};
