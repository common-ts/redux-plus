import {ActionsObservable, ofType} from 'redux-observable';
import {Observable, throwError} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {Metadata} from '../model/Metadata';
import {ReduxModel} from '../model/ReduxModel';
import {DiffModel} from '../model/DiffModel';
import {SearchModel, SearchResult, ReduxSearchModel} from '../model/ReduxSearchModel';

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


export interface GenericActionType extends ViewActionType {
  updateType: string;
  insertType: string;
}

export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  insert(obj: T, ctx?: any): Promise<R>;
  update(obj: T, ctx?: any): Promise<R>;
  patch?(obj: T, ctx?: any): Promise<R>;
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


export interface SearchActionType {
  searchType: string;
}

export interface SearchService<T, S extends SearchModel> {
  search(s: S): Promise<SearchResult<T>>;
}

export class SearchObservableEpics<T, S extends SearchModel> {
  constructor(private searchActionType: SearchActionType, private searchService: SearchService<T, S>) {
    this.search = this.search.bind(this);
  }

  search(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
  // search = action$ => action$.pipe(
    return action$.pipe(
      ofType(this.searchActionType.searchType),
      flatMap((action: ReducerModel<ReduxSearchModel<T, S>, SearchActionType>) => {
        const { searchModel: searchModel, callback } = action.payload;
        return fromPromise(this.searchService.search(searchModel)).pipe(
          map((list: SearchResult<T>) => {
            callback.showResults(searchModel, list);
            return ({
              type: BaseActionType.ACTION_SUCCESS
            });
          }),
          catchError((error) => throwError(error))
        );
      })
    );
  }
}

export interface ViewSearchActionType extends ViewActionType, SearchActionType {

}

export interface ViewSearchService<T, ID, S extends SearchModel>
  extends ViewService<T, ID>, SearchService<T, S> {
}

export class ViewSearchObservableEpics<T, ID, R, S extends SearchModel> extends ViewObservableEpics<T, ID> {
  constructor(genericSearchActionType: ViewSearchActionType, genericSearchService: ViewSearchService<T, ID, S>) {
    super(genericSearchActionType, genericSearchService);
    this.searchObservableEpics = new SearchObservableEpics(genericSearchActionType, genericSearchService);
    this.search = this.search.bind(this);
  }
  private searchObservableEpics: SearchObservableEpics<T, S>;
  search(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return this.searchObservableEpics.search(action$);
  }
}

export interface GenericSearchActionType extends GenericActionType, SearchActionType {

}

export interface GenericSearchService<T, ID, R, S extends SearchModel>
  extends GenericService<T, ID, R>, SearchService<T, S> {
}

export class GenericSearchObservableEpics<T, ID, R, S extends SearchModel> extends GenericObservableEpics<T, ID, R> {
  constructor(genericSearchActionType: GenericSearchActionType, genericSearchService: GenericSearchService<T, ID, R, S>) {
    super(genericSearchActionType, genericSearchService);
    this.searchObservableEpics = new SearchObservableEpics(genericSearchActionType, genericSearchService);
    this.search = this.search.bind(this);
  }
  private searchObservableEpics: SearchObservableEpics<T, S>;
  search(action$: ActionsObservable<any>): Observable<ReducerActionType<string>> {
    return this.searchObservableEpics.search(action$);
  }
}


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
