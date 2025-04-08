'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';

interface TaskItemProps {
  task: Task;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  const { toggleTaskCompletion, deleteTask } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 处理任务完成状态切换
  const handleToggle = async () => {
    setIsAnimating(true);
    // 添加震动反馈（如果浏览器支持）
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    await toggleTaskCompletion(task.id);
    // 动画结束后重置状态
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <motion.div
      className="flex items-center p-4 mb-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <motion.button
        className={`flex-shrink-0 w-6 h-6 mr-4 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-[#58CC02] border-[#58CC02]' : 'border-gray-300 hover:border-[#58CC02] hover:bg-[#58CC02]/10'}`}
        onClick={handleToggle}
        whileTap={{ scale: 0.9 }}
      >
        {task.completed && (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        )}
      </motion.button>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <span className={`text-base font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </span>
          {task.startTime && (
            <span className="text-sm text-gray-500 ml-2 font-medium">{task.startTime}</span>
          )}
        </div>
        {task.details && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{task.details}</p>
        )}
      </div>
      <motion.button
        className="ml-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        onClick={async () => {
          setIsDeleting(true);
          await deleteTask(task.id);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={isDeleting}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default TaskItem;