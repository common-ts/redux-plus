export interface SearchModel {
  limit: number;
}

export interface SearchResult<T> {
  results: T[];
}

export interface ReduxSearchCallback<T, S extends SearchModel> {
  showResults: (obj: S, result: SearchResult<T>) => void;
  handleError: (response: any) => void;
}

export interface ReduxSearchModel<T, S extends SearchModel> {
  searchModel: S;
  callback: ReduxSearchCallback<T, S>;
}
