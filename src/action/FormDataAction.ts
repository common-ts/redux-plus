import {actionFormDataState} from './updateGlobalState';

type actionsTypeFormData = typeof actionFormDataState;

export type FormDataAction = ReturnType<actionsTypeFormData[keyof actionsTypeFormData]>;

