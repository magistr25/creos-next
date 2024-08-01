import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface LoadingState {
    isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: true,
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;
export const selectIsLoading = (state: RootState): boolean => state.loading.isLoading;
export default loadingSlice.reducer;
