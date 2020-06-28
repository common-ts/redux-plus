import {FormDataAction} from '../action/FormDataAction';
import {FormDataStateActionType} from '../action/FormDataStateActionType';

function initGlobalState<T extends object>(): T {
  const t: any = {};
  return t;
}

export function formDataStateReducer<T extends object>(state: T = initGlobalState(), action: FormDataAction) {
  switch (action.type) {
    case FormDataStateActionType.SET_FORM_DATA:
      const data = Object.assign({}, state[action.payload.formName], action.payload.data);
      return { ...(state as object), [action.payload.formName]: data };
    default:
      return state;
  }
}
