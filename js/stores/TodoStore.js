import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events'
import { CREATE_TODO, DELETE_TODO, COMPLETE_TODO } from '../actions/TodoActions'

const CHANGE_EVENT = 'change'

let _todos = [];

function appendTodo(todo){
  _todos = [todo, ..._todos]
}

function deleteTodo(id){
  _todos = _todos.filter(
    (todo)=>{
      return todo.id !== id
    }
  )
}

function completeTodo(id){
  _todos = _todos.map(
    (todo)=>{
      if(todo.id == id){
        todo.completed = true;
      }
      return todo
    }
  )
}

const TodoStore = Object.assign({}, EventEmitter.prototype, {
  getTodos(){
    return _todos.filter(function(todo){
      return !todo.completed
    })
  },

  getCompletedTodos(){
    return _todos.filter(function(todo){
      return todo.completed
    })
  },

  emitChange() {
   this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
})

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  console.log(action.actionType);
  switch(action.actionType) {
    case CREATE_TODO:
      appendTodo(action.todo);
      TodoStore.emitChange();
      break;

    case DELETE_TODO:
      deleteTodo(action.id);
      TodoStore.emitChange();
      break;

    case COMPLETE_TODO:
      completeTodo(action.id);
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});

export default TodoStore
