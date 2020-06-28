import {combineReducers} from 'redux';
import {reducer} from 'redux-form';

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
