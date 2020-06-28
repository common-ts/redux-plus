import {ActionsObservable} from 'redux-observable';
import {Observable} from 'rxjs';
import {ReducerActionType} from '../action/ReducerActionType';
import {ApprActionType, ApprObservableEpics, ApprService} from './ApprObservableEpics';
import {DiffActionType, DiffObservableEpics, DiffService} from './DiffObservableEpics';

export interface DiffApprActionType extends DiffActionType, ApprActionType {

}

export interface DiffApprService<T, ID> extends DiffService<T, ID>, ApprService<ID> {

}

export class DiffApprObservableEpics<T, ID> extends ApprObservableEpics<ID> {
  constructor(actionType: DiffApprActionType, service: DiffApprService<T, ID>) {
    super(actionType, service);
    this.diffObservableEpics = new DiffObservableEpics<T, ID>(actionType, service);
    this.diff = this.diff.bind(this);
  }
  private diffObservableEpics: DiffObservableEpics<T, ID>;
  diff(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return this.diffObservableEpics.diff(action$);
  }
}
