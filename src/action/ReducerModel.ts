import {ReducerActionType} from './ReducerActionType';

export interface ReducerModel<T, A> extends ReducerActionType<A> {
  payload: T;
}
