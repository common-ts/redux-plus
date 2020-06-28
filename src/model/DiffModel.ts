export interface DiffModel<T, ID> {
  id: ID;
  oldValue: T;
  newValue: T;
}
