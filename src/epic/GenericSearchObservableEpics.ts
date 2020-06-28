import {ActionsObservable} from 'redux-observable';
import {Observable} from 'rxjs';
import {ReducerActionType} from '../action/ReducerActionType';
import {SearchModel} from '../model';
import {GenericActionType, GenericObservableEpics, GenericService} from './GenericObservableEpics';
import {SearchActionType, SearchObservableEpics, SearchService} from './SearchObservableEpics';

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
