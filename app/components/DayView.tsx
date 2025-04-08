'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { useAppContext } from '../context/AppContext';

const DayView: React.FC = () => {
  const { state, addTask, updateTasksOrder } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [contextId] = useState('tasks-context'); // Add stable context ID
  
  // 格式化当前选中日期
  const formattedDate = format(new Date(state.selectedDate), 'yyyy年MM月dd日');
  
  // 获取当天的任务
  const tasksForDay = state.tasks
    .filter(task => task.date === state.selectedDate)
    .sort((a, b) => a.order - b.order);
  
  // 处理添加新任务
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), state.selectedDate);
      setNewTaskTitle('');
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(tasksForDay);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // 更新任务顺序
    const updatedTasks = items.map((task, index) => ({
      ...task,
      order: index
    }));
    
    updateTasksOrder(updatedTasks);
  };
  
  return (
    <div className="p-4">
      <motion.h2 
        className="text-xl font-bold mb-4 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {formattedDate}
      </motion.h2>
      
      {/* 添加任务表单 */}
      <motion.form 
        className="mb-6"
        onSubmit={handleAddTask}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="添加新任务..."
            className="flex-grow p-3 outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-[#58CC02] text-white px-4 py-2 font-medium text-sm hover:bg-[#46a302] transition-colors"
            disabled={!newTaskTitle.trim()}
          >
            添加
          </button>
        </div>
      </motion.form>
      
      {/* 任务列表 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks" type="task-list" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} key={contextId}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
              data-rbd-droppable-context-id={contextId}
            >
              <AnimatePresence>
                {tasksForDay.length > 0 ? (
                  tasksForDay.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskItem task={task} index={index} />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-8 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    今天还没有任务，添加一个吧！
                  </motion.div>
                )}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DayView;