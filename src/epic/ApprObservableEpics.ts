import {ActionsObservable, ofType} from 'redux-observable';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {ReduxModel} from '../model/ReduxModel';

export interface ApprActionType {
  approveType: string;
  rejectType: string;
}

export enum Status {
  NotFound = 0,
  Success = 1,
  VersionError = 2,
  Error = 4
}

export interface ApprService<ID> {
  approve(id: ID): Promise<Status>;
  reject(id: ID): Promise<Status>;
}

export class ApprObservableEpics<ID> {
  constructor(private actionType: ApprActionType, private service: ApprService<ID>) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  approve(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return action$.pipe(
      ofType(this.actionType.approveType),
      flatMap((action: ReducerModel<ReduxModel<any, Status>, ApprActionType>) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.service.approve(parameter)).pipe(
          map((status: Status) => {
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
