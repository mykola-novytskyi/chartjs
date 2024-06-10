import { LoadingState } from './loading-state.enum';

export interface ErrorState {
  error: string;
}

export type CallState = LoadingState | ErrorState;

export interface BaseState {
  callState: CallState;
}
