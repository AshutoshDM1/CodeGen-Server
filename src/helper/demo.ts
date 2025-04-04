export const defaultresult = `Okay, I will create a stylish to-do list application using React, Tailwind CSS, and Framer Motion.

1.  Greetings!
2.  The following files will be created or modified:

    *   \`src/App.tsx\`
    *   \`src/components/TodoList.tsx\`
    *   \`src/components/TodoItem.tsx\`
    *   \`src/components/AddTodoForm.tsx\`
3.  This application will allow you to add, remove, and mark todos as complete, with smooth animations provided by Framer Motion.

<boltArtifact id="todo-list-app" title="Todo List App with Framer Motion">

<boltAction type="file" filePath="src/App.tsx">
  import React, { useState } from 'react'; 
  import { motion } from 'framer-motion';
  import { Todo } from './models/todo';
  import TodoList from './components/TodoList';
  import AddTodoForm from './components/AddTodoForm';
  import { ListTodoIcon } from 'lucide-react';

    function App() {
      const [todos, setTodos] = useState<Todo[]>([]);

      const addTodo = (text: string) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
        };
        setTodos([...todos, newTodo]);
      };

      const toggleComplete = (id: string) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      };

      const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
      };

      return (
        <div>
          <ListTodoIcon size={48} className="text-blue-500" />
          <h1>Todo List</h1>
          <AddTodoForm onAddTodo={addTodo} />
          {todos.length > 0 ? (
            <TodoList todos={todos} onToggleComplete={toggleComplete} onDelete={deleteTodo} />
          ) : (
            <p>No todos yet! Add some tasks.</p>
          )}
        </div>
      );
    }

    export default App;
  </boltAction>

  <boltAction type="file" filePath="src/components/TodoItem.tsx">
    import React from 'react';
    import { Todo } from '../models/todo';
    import { motion } from 'framer-motion';
    import { CheckCircle2Icon, Trash2Icon } from 'lucide-react';

    interface TodoItemProps {
      todo: Todo;
      onToggleComplete: (id: string) => void;
      onDelete: (id: string) => void;
    }

    const TodoItem: React.FC<TodoItemProps> = ({
      todo,
      onToggleComplete,
      onDelete,
    }) => {
      return (
        <div>
          <span>{todo.text}</span>
          <CheckCircle2Icon 
            size={20} 
            onClick={() => onToggleComplete(todo.id)} 
          />
          <Trash2Icon size={20} className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => onDelete(todo.id)} />
        </div>
      );
    };

    export default TodoItem;
  </boltAction>

  <boltAction type="file" filePath="src/newcomponents/TodoList.tsx">
    import React from 'react';
    import { Todo } from '../models/todo';
    import TodoItem from './TodoItem';
    import { motion } from 'framer-motion';

    interface TodoListProps {
      todos: Todo[];
      onToggleComplete: (id: string) => void;
      onDelete: (id: string) => void;
    }

    const TodoList: React.FC<TodoListProps> = ({
      todos,
      onToggleComplete,
      onDelete,
    }) => {
      return (
        <div className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
          ))}
        </div>
      );
    };

    export default TodoList;
  </boltAction>

  
</boltArtifact>

I have completed the task. You can now view the to-do list application in the preview.`;
