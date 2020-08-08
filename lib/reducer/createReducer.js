"use strict";
var __assign=(this && this.__assign) || function(){
  __assign = Object.assign || function(t){
    for (var s, i = 1, n = arguments.length; i < n; i++){
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports,"__esModule",{value:true});
var redux_1 = require("redux");
var redux_form_1 = require("redux-form");
var GlobalStateActionType_1 = require("../action/GlobalStateActionType");
var FormDataStateActionType_1 = require("../action/FormDataStateActionType");
exports.createReducer = function(asyncReducers){
  return redux_1.combineReducers(__assign({ form: redux_form_1.reducer }, asyncReducers));
};
function initGlobalState(){
  var t = {};
  return t;
}
function formDataStateReducer(state, action){
  var _a;
  if (state === void 0){ state = initGlobalState(); }
  switch (action.type){
    case FormDataStateActionType_1.FormDataStateActionType.SET_FORM_DATA:
      var data = Object.assign({}, state[action.payload.formName], action.payload.data);
      return __assign(__assign({}, state), (_a = {}, _a[action.payload.formName] = data, _a));
    default:
      return state;
  }
}
exports.formDataStateReducer = formDataStateReducer;
function globalStateReducer(state, action){
  if (state === void 0){ state = initGlobalState(); }
  switch (action.type){
    case GlobalStateActionType_1.GlobalStateActionType.INIT_DATA:
      return __assign(__assign({}, state), { initData: action.payload });
    case GlobalStateActionType_1.GlobalStateActionType.UPDATE_GLOBAL_STATE:
      if (typeof action.payload === 'string'){
        delete state[action.payload];
        return state;
      }
      else {
        return __assign(__assign({}, state), action.payload);
      }
    default:
      return state;
  }
}
exports.globalStateReducer = globalStateReducer;
