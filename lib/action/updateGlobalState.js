"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormDataStateActionType_1 = require("./FormDataStateActionType");
var GlobalStateActionType_1 = require("./GlobalStateActionType");
function createAction(d) {
  return d;
}
function setFormDataAction(formName, data) {
  return createAction({
    type: FormDataStateActionType_1.FormDataStateActionType.SET_FORM_DATA,
    payload: {
      formName: formName,
      data: data
    }
  });
}
exports.setFormDataAction = setFormDataAction;
exports.actionFormDataState = {
  setFormDataAction: setFormDataAction
};
function updateGlobalState(data) {
  return createAction({
    type: GlobalStateActionType_1.GlobalStateActionType.UPDATE_GLOBAL_STATE,
    payload: data
  });
}
exports.updateGlobalState = updateGlobalState;
