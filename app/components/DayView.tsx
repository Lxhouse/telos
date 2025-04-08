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
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
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
      addTask(newTaskTitle.trim(), state.selectedDate, undefined, newTaskTime, newTaskDetails);
      setNewTaskTitle('');
      setNewTaskTime('');
      setNewTaskDetails('');
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
      
      {/* 添加任务按钮 */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#58CC02] text-white rounded-full shadow-lg hover:bg-[#46a302] transition-colors flex items-center justify-center z-10"
        onClick={() => setShowAddForm(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* 添加任务表单 */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddForm(false);
              }
            }}
          >
            <motion.form 
              className="w-full max-w-lg mx-4"
              onSubmit={(e) => {
                handleAddTask(e);
                setShowAddForm(false);
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3 bg-white p-6 rounded-xl shadow-xl">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="添加新任务..."
                  className="w-full p-3 border rounded-lg outline-none text-sm"
                  autoFocus
                />
                <div className="flex gap-3">
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="p-3 border rounded-lg outline-none text-sm"
                  />
                  <textarea
                    value={newTaskDetails}
                    onChange={(e) => setNewTaskDetails(e.target.value)}
                    placeholder="任务详情（可选）"
                    className="flex-grow p-3 border rounded-lg outline-none text-sm resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowAddForm(false)}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-[#58CC02] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#46a302] transition-colors"
                    disabled={!newTaskTitle.trim()}
                  >
                    添加
                  </button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      
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