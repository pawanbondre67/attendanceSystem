export interface SnackBarState {
  visible: boolean;
  message: string;
  severity: 'info' | 'success' | 'error' | 'warning';
}
