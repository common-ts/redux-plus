import {ActionsObservable, ofType} from 'redux-observable';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {Metadata} from '../model/Metadata';
import {ReduxModel} from '../model/ReduxModel';

export interface ViewActionType {
  getByIdType: string;
}

export interface ViewService<T, ID> {
  metadata(): Metadata;
  keys(): string[];
  load(id: ID, ctx?: any): Promise<T>;
}

export class ViewObservableEpics<T, ID> {
  constructor(private viewActionType: ViewActionType, private viewService: ViewService<T, ID>) {
    this.load = this.load.bind(this);
  }

  load(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return action$.pipe(
      ofType(this.viewActionType.getByIdType),
      flatMap((action: ReducerModel<ReduxModel<any, T>, ViewActionType>) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.viewService.load(parameter)).pipe(
          map((res: T) => {
            execute(res);
            return ({
              type: BaseActionType.ACTION_SUCCESS
            });
          }),
          catchError((err) => {
            handleError(err);
            return null;
          })
        );
      })
    );
  }
}
