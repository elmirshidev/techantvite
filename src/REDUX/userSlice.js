import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    user:null,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        auth: (state,action) => {
            state.user = action.payload;
        } ,
        logout: (state,action) => {
            state.user = null;
        }
    }
})

export const { auth,logout } = userSlice.actions;
export default  userSlice.reducer;
