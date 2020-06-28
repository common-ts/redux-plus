export const GLOBAL_STATE = 'globalState';
export const FORM_DATA_STATE = 'formDataState';

export * from './epic/EpicFormatter';
export * from './action/GlobalStateActionType';
export * from './action/FormDataStateActionType';
export * from './action/AtLeastOneType';
export * from './action/FormDataAction';
export * from './action/GlobalStateAction';
export * from './action/ReducerActionType';
export * from './action/updateGlobalState';
export * from './action/actions';
export * from './reducer/formDataStateReducer';
export * from './reducer/globalStateReducer';

export * from './model/ReduxSearchModel';
export * from './model/ReduxModel';

export * from './epic/ViewObservableEpics';
export * from './epic/GenericObservableEpics';
export * from './epic/SearchObservableEpics';
export * from './epic/DiffObservableEpics';
export * from './epic/ApprObservableEpics';
export * from './epic/ViewSearchObservableEpics';
export * from './epic/GenericSearchObservableEpics';
export * from './epic/GenericSearchDiffApprObservableEpics';

export * from './reducer/createReducer';
