import {ActionsObservable, ofType} from 'redux-observable';
import {Observable, throwError} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, flatMap, map} from 'rxjs/operators';
import {BaseActionType} from '../action/BaseActionType';
import {ReducerActionType} from '../action/ReducerActionType';
import {ReducerModel} from '../action/ReducerModel';
import {ReduxSearchModel, SearchModel, SearchResult} from '../model';

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
