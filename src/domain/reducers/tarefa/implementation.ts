import { Actor, AllActions, Remove, Search, Toggle, Write, Add, TarefaActionsEnum, TarefasState } from "./types";

export const makeInitialTarefaState = (): TarefasState => {
  const tarefaStr = localStorage.getItem("tarefas");
  const tarefas = tarefaStr ? JSON.parse(tarefaStr) : [];

  return {
    tarefas: tarefas,
    error: "",
    name: "",
    search: "",
  };
};


export const saveToLocalStorage = (state: any) => {
  const tarefasStr = JSON.stringify(state);
  localStorage.setItem("tarefas", tarefasStr);
};

export const removeTask: Actor<Remove> = (state, action) => {
  return {
    ...state,
    tarefas: state.tarefas.filter((tarefa) => tarefa.id !== action.payload.id),
  };
};

export const toggleTask: Actor<Toggle> = (state, action) => {
  const tarefa = {
    ...state,
    tarefas: state.tarefas.map((t) =>
      t.id === action.payload.id ? { ...t, done: !t.done } : t
    ),
  };

  saveToLocalStorage(tarefa);
  return tarefa;
};

export const writeTask: Actor<Write> = (state, { payload }) => {

  const hasTaskAlready = state.tarefas.some((t) => t.name === payload.name);

  if (hasTaskAlready) {
    return {
      ...state,
      name: payload.name,
      error: "Nome da tarefa já existe",
    };
  }

  return {
    ...state,
    error: "",
    name: payload.name,
  };
};

export const addTask: Actor<Add> = (state) => {
  if (state.name === "") {
    return {
      ...state,
      error: "Nome da tarefa não pode ser vazio",
    };
  }

  if (state.error) {
    return state;
  }

  const tarefas = [...state.tarefas];
  const newTask = {
    id: (tarefas.length + 1).toString(),
    name: state.name,
    done: false,
    createdAt: new Date(),
  };

  tarefas.push(newTask);

  saveToLocalStorage(newTask)

  return {
    ...state,
    tarefas,
    error: "",
    name: "",
  };
};

export const searchTask: Actor<Search> = (state, action) => {
  return {
    ...state,
    search: action.payload.search,
  };
};

export const tarefaReducer = (
  state: TarefasState,
  action: AllActions
): TarefasState => {
  switch (action.type) {
    case TarefaActionsEnum.add:
      return addTask(state, action);

    case TarefaActionsEnum.remove:
      return removeTask(state, action);

    case TarefaActionsEnum.toggle:
      return toggleTask(state, action);

    case TarefaActionsEnum.write:
      return writeTask(state, action);

    case TarefaActionsEnum.search:
      return searchTask(state, action);

    default:
      return state;
  }
};
