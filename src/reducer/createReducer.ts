import {combineReducers} from 'redux';
import {reducer} from 'redux-form';
import {GlobalStateAction} from '../action/GlobalStateAction';
import {GlobalStateActionType} from '../action/GlobalStateActionType';
import {FormDataAction} from '../action/FormDataAction';
import {FormDataStateActionType} from '../action/FormDataStateActionType';

export interface GlobalState<G> {
  globalState: G;
}

export interface ReduxState<G, F> extends GlobalState<G> {
  form: any;
  formDataState: F;
}

export const createReducer = asyncReducers =>
  combineReducers<ReduxState<any, any>>({
    form: reducer,
    ...asyncReducers
});

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

export function globalStateReducer<T extends object>(state: T = initGlobalState(), action: GlobalStateAction) {
  switch (action.type) {
    case GlobalStateActionType.INIT_DATA:
      return { ...(state as object), initData: action.payload };
    case GlobalStateActionType.UPDATE_GLOBAL_STATE:
      if (typeof action.payload === 'string') {
        delete state[action.payload];
        return state;
      } else {
        return { ...(state as object), ...action.payload };
      }
    default:
      return state;
  }
}
