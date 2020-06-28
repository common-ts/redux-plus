import {ActionsObservable, ofType} from 'redux-observable';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {SearchModel} from '../model';
import {ReduxModel} from '../model/ReduxModel';
import {Status} from './ApprObservableEpics';
import {DiffApprActionType, DiffApprObservableEpics, DiffApprService} from './DiffApprObservableEpics';
import {GenericSearchActionType, GenericSearchObservableEpics, GenericSearchService} from './GenericSearchObservableEpics';

export interface GenericSearchDiffApprActionType extends GenericSearchActionType, DiffApprActionType {

}

export interface GenericSearchDiffApprService<T, ID, R, S extends SearchModel> extends GenericSearchService<T, ID, R, S>, DiffApprService<T, ID> {

}

export class GenericSearchDiffApprObservableEpics<T, ID, R, S extends SearchModel> extends GenericSearchObservableEpics<T, ID, R, S> {
  constructor(private actionType: GenericSearchDiffApprActionType, private service: GenericSearchDiffApprService<T, ID, R, S>) {
    super(actionType, service);
    this.diffObservableEpics = new DiffApprObservableEpics<T, ID>(actionType, service);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffObservableEpics: DiffApprObservableEpics<T, ID>;
  diff(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return this.diffObservableEpics.diff(action$);
  }

  approve(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return action$.pipe(
      ofType(this.actionType.approveType),
      flatMap((action: ReducerModel<ReduxModel<any, Status>, GenericSearchDiffApprActionType>) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.service.approve(parameter)).pipe(
          map(status => {
            execute(status);
            return ({
              type: BaseActionType.ACTION_SUCCESS
            });
          }),
          catchError(err => {
            // execute(StatusCode.Error, err);
            handleError(err);
            return null;
          })
        );
      })
    );
  }

  reject(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return action$.pipe(
      ofType(this.actionType.rejectType),
      flatMap((action: any) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.service.reject(parameter)).pipe(
          map((res) => {
            execute(true);
            return ({
              type: BaseActionType.ACTION_SUCCESS
            });
          }),
          // catchError((error) => handleError(error))
          catchError((error) => {
            execute(false, error);
            handleError(error);
            return null;
          })
        );
      })
    );
  }
}
