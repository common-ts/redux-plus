import {ActionsObservable, ofType} from 'redux-observable';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {DiffModel, Metadata} from '../model';
import {ReduxModel} from '../model/ReduxModel';

export interface DiffActionType {
  diff: string;
}

export interface DiffService<T, ID> {
  keys(): string[];
  diff(id: ID): Promise<DiffModel<T, ID>>;
}

export class DiffObservableEpics<T, ID> {
  constructor(private actionType: DiffActionType, private service: DiffService<T, ID>) {
    this.diff = this.diff.bind(this);
  }
  diff(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
  // public diff = action$ => action$.pipe(
    return action$.pipe(
      ofType(this.actionType.diff),
      flatMap((action: ReducerModel<ReduxModel<any, DiffModel<T, ID>>, DiffActionType>) => {
        const { parameter, callback } = action.payload;
        const {execute, handleError, formatData} = callback;
        return fromPromise(this.service.diff(parameter)).pipe(
          map((res: DiffModel<T, ID>) => {
            if (!res) {
              execute(null);
            } else {
              const formatedRes = formatData(res);
              execute(formatedRes);
            }
            return ({
              type: BaseActionType.ACTION_SUCCESS
            });
          }),
          catchError((error) => {
            handleError(error);
            return null;
          })
        );
      })
    );
  }
}
