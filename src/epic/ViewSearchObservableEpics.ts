import {ActionsObservable} from 'redux-observable';
import {Observable} from 'rxjs';
import {ReducerActionType} from '../action/ReducerActionType';
import {SearchModel} from '../model';
import {SearchActionType, SearchObservableEpics, SearchService} from './SearchObservableEpics';
import {ViewActionType, ViewObservableEpics, ViewService} from './ViewObservableEpics';

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
