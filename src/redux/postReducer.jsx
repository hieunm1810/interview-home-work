import { createSlice } from "@reduxjs/toolkit";
import { http } from "../utils/config";

const initialState = {
  arrPosts: [],
  arrSearch: [],
  searchValue: "",
  arrScroll: [],
  hasMore: true,
};

const postReducer = createSlice({
  name: "postReducer",
  initialState,
  reducers: {
    setArrPostsAction: (state, action) => {
      state.arrPosts = action.payload;
    },
    setArrSearchAction: (state, action) => {
      state.arrSearch = action.payload;
    },
    setSearchValueAction: (state, action) => {
      state.searchValue = action.payload;
      return state;
    },
    setArrScrollAction: (state, action) => {
      state.arrScroll = action.payload;
    },
    setHasMoreAction: (state, action) => {
      state.arrScroll = action.payload;
      return state;
    },
  },
});

export const {
  setArrPostsAction,
  setArrSearchAction,
  setSearchValueAction,
  setArrScrollAction,
  setHasMoreAction,
} = postReducer.actions;

export default postReducer.reducer;

export const getPostApi = async (dispatch) => {
  try {
    const api = await http.get("/posts");
    console.log(api.data);
    const action = setArrPostsAction(api.data);
    dispatch(action);
  } catch (error) {
    console.log(error);
  }
};
