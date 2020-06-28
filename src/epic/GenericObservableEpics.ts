import {ActionsObservable, ofType} from 'redux-observable';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {ReduxModel} from '../model/ReduxModel';
import {ViewActionType, ViewObservableEpics, ViewService} from './ViewObservableEpics';

export interface GenericActionType extends ViewActionType {
  updateType: string;
  insertType: string;
}

export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  patch(obj: T, body: any): Promise<R>;
  insert(obj: T): Promise<R>;
  update(obj: T): Promise<R>;
  delete?(id: ID): Promise<number>;
}

export class GenericObservableEpics<T, ID, R> extends ViewObservableEpics<T, ID> {
  constructor(private genericActionType: GenericActionType, private genericService: GenericService<T, ID, R>) {
    super(genericActionType, genericService);
    this.update = this.update.bind(this);
    this.insert = this.insert.bind(this);
  }

  update(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return action$.pipe(
  // update = action$ => action$.pipe(
      ofType(this.genericActionType.updateType),
      flatMap((action: ReducerModel<ReduxModel<T, R>, GenericActionType>) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.genericService.update(parameter)).pipe(
          map((res: R) => {
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
  insert(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
  // insert = action$ => action$.pipe(
    return action$.pipe(
      ofType(this.genericActionType.insertType),
      flatMap((action: ReducerModel<ReduxModel<T, R>, GenericActionType>) => {
        const { parameter, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.genericService.insert(parameter)).pipe(
          map((res: R) => {
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

  patch(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
  // patch = action$ => action$.pipe(
    return action$.pipe(
      ofType(this.genericActionType.insertType),
      flatMap((action: ReducerModel<ReduxModel<T, R>, GenericActionType>) => {
        const { parameter, body, callback } = action.payload;
        const { execute, handleError } = callback;
        return fromPromise(this.genericService.patch(parameter, body)).pipe(
          map((res: R) => {
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
