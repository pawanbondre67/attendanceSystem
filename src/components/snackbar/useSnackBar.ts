// useSnackBar.ts
import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {toggleSnackBarVisibility} from '../../redux/slices/snackbarSlice/index';

const useSnackBar = () => {
  const {visible, message, severity} = useAppSelector(state => state.snackbar);
  const dispatch = useAppDispatch();

  const onDismissSnackBar = () => {
    dispatch(toggleSnackBarVisibility());
  };

  return {visible, onDismissSnackBar, message, severity};
};

export default useSnackBar;
