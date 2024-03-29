import React, { createContext, useContext, useReducer, useEffect } from "react";

import axios from "axios";

// initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeCollection: [],
  incompleteCollection: [],
  pending:[]
};

// reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };
    case "SET_COMPLETE_COLLECTION":
      return {
        ...state,
        completeCollection: action.payload,
      };
    case "SET_INCOMPLETE_COLLECTION":
      return {
        ...state,
        incompleteCollection: action.payload,
      };
      case "SET_PENDING":
        return {
          ...state,
          pending: action.payload,
        };
    case "RESET_USER":
      return {
        ...state,
        user: null,
        completeCollection: [],
        incompleteCollection: [],
        pending: [],
        fetchingUser: false,
      };
    default:
      return state;
  }
};

// create the context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // action: get current user
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/auth/current");
      // console.log(res);
      if (res.data) {
        const toComRes = await axios.get("/api/user/current");
        console.log(res)
        console.log(toComRes)



        if (toComRes.data) {
          dispatch({
             type: "SET_USER",
              payload: res.data,
            });
             if(res.data.role === 'Collector'){
                const pends = await axios.get("api/admin/collection");
                console.log(pends.data);
                if(pends.data) {
                  dispatch({
                    type: "SET_PENDING",
                    payload: pends.data.incompleted,
                  })
                }
              }
          dispatch({
            type: "SET_COMPLETE_COLLECTION",
            payload: toComRes.data.complete,
          });
          dispatch({
            type: "SET_INCOMPLETE_COLLECTION",
            payload: toComRes.data.incomplete,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };


  const logout = async () => {

    try {
      await axios.put("/api/auth/logout");
      dispatch({ type: "RESET_USER" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  // const addToDo = (toDo) => {
  //   dispatch({
  //     type: "SET_INCOMPLETE_TODOS",
  //     payload: [toDo, ...state.incompleteToDos],
  //   });
  // };

  const toDoComplete = (toDo) => {
    dispatch({
      type: "SET_INCOMPLETE_COLLECTION",
      payload: state.incompleteToDos.filter(
        (incompleteToDo) => incompleteToDo._id !== toDo._id
      ),
    });

    dispatch({
      type: "SET_COMPLETE_COLLECTION",
      payload: [toDo, ...state.completeToDos],
    });
  };

  // const toDoIncomplete = (toDo) => {
  //   dispatch({
  //     type: "SET_COMPLETE_TODOS",
  //     payload: state.completeToDos.filter(
  //       (completeToDo) => completeToDo._id !== toDo._id
  //     ),
  //   });

  //   const newIncompleteToDos = [toDo, ...state.incompleteToDos];

  //   dispatch({
  //     type: "SET_INCOMPLETE_TODOS",
  //     payload: newIncompleteToDos.sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     ),
  //   });
  // };

  // const removeT0Complete = (toComplete) => {
  //   if (toComplete.complete) {
  //     dispatch({
  //       type: "SET_COMPLETE_TODOS",
  //       payload: state.completeToDos.filter(
  //         (completeToDo) => completeToDo._id !== toDo._id
  //       ),
  //     });
  //   } else {
  //     dispatch({
  //       type: "SET_INCOMPLETE_TODOS",
  //       payload: state.incompleteToDos.filter(
  //         (incompleteToDo) => incompleteToDo._id !== toDo._id
  //       ),
  //     });
  //   }
  // };

  // const CompleteCollect = (toCom) => {
  //   if(toCom.complete) {
  //     const NewcompleteCollection = state.completeCollection.map( (toComplete) => 

  //       );
  //   }
  // }

  // const updateToDo = (toDo) => {
  //   if (toDo.complete) {
  //     const newCompleteToDos = state.completeToDos.map((completeToDo) =>
  //       completeToDo._id !== toDo._id ? completeToDo : toDo
  //     );

  //     dispatch({
  //       type: "SET_COMPLETE_TODOS",
  //       payload: newCompleteToDos,
  //     });
  //   } else {
  //     const newIncompleteToDos = state.incompleteToDos.map((incompleteToDo) =>
  //       incompleteToDo._id !== toDo._id ? incompleteToDo : toDo
  //     );

  //     dispatch({
  //       type: "SET_INCOMPLETE_TODOS",
  //       payload: newIncompleteToDos,
  //     });
  //   }
  // };

  const value = {
    ...state,
    getCurrentUser,
    logout,
    toDoComplete
  };

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}