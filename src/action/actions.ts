import {FormDataStateActionType} from './FormDataStateActionType';
import {GlobalStateActionType} from './GlobalStateActionType';
import {ReducerModel} from './ReducerModel';
import {updateGlobalState} from './updateGlobalState';

function createAction<T extends ReducerModel<any, GlobalStateActionType | FormDataStateActionType>>(d: T): T {
  return d;
}

export const initData = (jsonObject: any) => createAction({
  type: GlobalStateActionType.INIT_DATA,
  payload: jsonObject
});

export const actionsGlobalState = {
  initData,
  updateGlobalState
};
