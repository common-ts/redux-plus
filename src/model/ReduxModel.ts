export interface ReduxCallback<T> {
  execute: (obj: T) => void;
  formatData?: (obj: T) => T;
  handleError: (response: any) => void;
}

export interface ReduxModel<T, K> {
  parameter: T;
  body?: any;
  callback: ReduxCallback<K>;
}
