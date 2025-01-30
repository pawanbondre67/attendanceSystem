import {useAppDispatch, useAppSelector} from '../../redux/hook/hook';
import {toggleSnackBarVisibility} from '../../redux/slices/snackbarSlice/index';

const useSnackBar = (): { visible: boolean, onDismissSnackBar: () => void, message: string } => {
  const {visible, message} = useAppSelector(state => state.snackbar);
  const dispatch = useAppDispatch();
  const onDismissSnackBar = () => {
    dispatch(toggleSnackBarVisibility());
  };
  return {visible, onDismissSnackBar, message};
};
export default useSnackBar;
