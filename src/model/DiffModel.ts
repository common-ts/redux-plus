export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}
