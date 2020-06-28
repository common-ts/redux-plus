export interface SearchModel {
  keyword: string;
  sortField: string;
  sortType: string;
  pageIndex: number;
  pageSize: number;
  initPageSize: number;
  fields: string[];
  excluding: any;
}

export interface SearchResult<T> {
  itemTotal: number;
  results: T[];
  lastPage: boolean;
}

export interface ReduxSearchCallback<T, S extends SearchModel> {
  showResults: (obj: S, result: SearchResult<T>) => void;
  handleError: (response: any) => void;
}

export interface ReduxSearchModel<T, S extends SearchModel> {
  searchModel: S;
  callback: ReduxSearchCallback<T, S>;
}
