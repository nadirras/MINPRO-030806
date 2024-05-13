import { useDispatch, useSelector, useStore } from 'react-redux';

export const useAppDispatch = useDispatch.withTypes<any>();
export const useAppSelector = useSelector.withTypes<any>();
export const useAppStore = useStore.withTypes<any>();

