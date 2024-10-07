import { createSlice } from "@reduxjs/toolkit";

const UserSlice= createSlice({
    name:"User",
    initialState:null,
    reducers:{
        addUserData:(state, action)=>{
        return { ...action.payload };
        }

        //  we can add more reducer function as per our need...
    }
})

export const {addUserData} = UserSlice.actions;
export default UserSlice.reducer;