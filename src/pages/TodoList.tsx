
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  X, 
  Calendar,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { generateUniqueId, sampleTodoData } from "@/lib/utils";
import { toast } from "sonner";

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(sampleTodoData);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: generateUniqueId(),
      title: newTodo.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      completed: false
    };

    setTodos([...todos, todo]);
    setNewTodo("");
    setDueDate("");
    setIsAddingTodo(false);
    toast.success("Task added successfully");
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success("Task removed");
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.title);
    setDueDate(todo.dueDate);
    setIsAddingTodo(true);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !newTodo.trim()) return;
    
    setTodos(todos.map(todo => 
      todo.id === editingTodo.id 
        ? { ...todo, title: newTodo.trim(), dueDate: dueDate || todo.dueDate } 
        : todo
    ));
    
    setNewTodo("");
    setDueDate("");
    setIsAddingTodo(false);
    setEditingTodo(null);
    toast.success("Task updated successfully");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isOverdue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 px-4 pb-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-brainbridge-blue to-brainbridge-lightblue">
            <h1 className="text-2xl font-bold text-white">Study Planner</h1>
            <p className="text-blue-100 mt-1">Organize your study sessions and track your progress</p>
          </div>
          
          {/* Todo List */}
          <div className="p-6">
            <AnimatePresence>
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-500 text-lg">No tasks yet</h3>
                  <p className="text-gray-400 text-sm mt-1">Add your first study task to get started</p>
                </motion.div>
              ) : (
                <ul className="space-y-3">
                  {todos.map(todo => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center p-3 rounded-lg border ${
                        todo.completed 
                          ? 'bg-green-50 border-green-100' 
                          : isOverdue(todo.dueDate) && !todo.completed
                            ? 'bg-red-50 border-red-100'
                            : 'bg-white border-gray-200'
                      }`}
                    >
                      <div 
                        onClick={() => handleToggleTodo(todo.id)}
                        className="cursor-pointer mr-3"
                      >
                        {todo.completed ? (
                          <CheckCircle2 size={22} className="text-green-500" />
                        ) : (
                          <Circle size={22} className="text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock size={14} className={`${
                            isOverdue(todo.dueDate) && !todo.completed
                              ? 'text-red-500'
                              : 'text-gray-400'
                          } mr-1`} />
                          <span className={`text-xs ${
                            isOverdue(todo.dueDate) && !todo.completed
                              ? 'text-red-500 font-medium'
                              : 'text-gray-500'
                          }`}>
                            {isOverdue(todo.dueDate) && !todo.completed ? 'Overdue: ' : 'Due: '}
                            {formatDate(todo.dueDate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditTodo(todo)}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </div>
          
          {/* Add Todo Form */}
          <AnimatePresence>
            {isAddingTodo ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t px-6 py-4 bg-gray-50"
              >
                <div className="space-y-4">
                  <Input
                    label="Task"
                    placeholder="Enter your study task..."
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    autoFocus
                  />
                  
                  <Input
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingTodo(false);
                        setNewTodo("");
                        setDueDate("");
                        setEditingTodo(null);
                      }}
                      leftIcon={<X size={16} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
                      disabled={!newTodo.trim()}
                    >
                      {editingTodo ? 'Update Task' : 'Add Task'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t px-6 py-4"
              >
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Plus size={16} />}
                  onClick={() => setIsAddingTodo(true)}
                >
                  Add New Study Task
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
