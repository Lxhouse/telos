'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import * as db from '../lib/db';

const WeekView: React.FC = () => {
  const { state, setSelectedDate, setView, getWeekRange, addTask, deleteTask, toggleTaskCompletion } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  
  // 获取周视图的日期范围
  const { start } = getWeekRange();
  const startDate = parseISO(start);
  const today = new Date();

  // 当选中日期变化时，重新加载数据
  useEffect(() => {
    const loadWeekTasks = async () => {
      const { start, end } = getWeekRange();
      const weekTasks = await db.getTasksByDateRange(start, end);
      // Tasks will be automatically updated through the context's state management
    };
    
    loadWeekTasks();
  }, [state.selectedDate]);
  
  // 生成一周的日期
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTasks = state.tasks.filter(task => task.date === dateStr);
    const completedTasks = dayTasks.filter(task => task.completed);
    
    return {
      date,
      dateStr,
      dayName: format(date, 'E'), // 星期几的缩写
      dayNumber: format(date, 'd'), // 日期数字
      totalTasks: dayTasks.length,
      completedTasks: completedTasks.length,
      isSelected: isSameDay(date, parseISO(state.selectedDate)),
      isToday: isSameDay(date, today)
    };
  });

  // 处理添加新任务
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() && selectedDayStr) {
      await addTask(newTaskTitle.trim(), selectedDayStr, undefined, newTaskTime, newTaskDetails);
      setNewTaskTitle('');
      setNewTaskTime('');
      setNewTaskDetails('');
      setSelectedDayStr(null);
    }
  };
  
  // 处理日期点击，切换到日视图
  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setView('day');
  };
  
  // 格式化周视图标题
  const weekRangeText = `${format(weekDays[0].date, 'yyyy-MM-dd')} ~ ${format(weekDays[6].date, 'yyyy-MM-dd')}`;
  
  return (
    <div className="p-4">
      <motion.h2 
        className="text-xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {weekRangeText}
      </motion.h2>
      
      <div className="flex flex-col gap-4 p-2">
        {weekDays.map((day, index) => (
          <div key={day.dateStr}>
            <motion.div
              className={`flex flex-col p-5 rounded-xl shadow-sm cursor-pointer transition-all ${day.isToday ? 'ring-2 ring-[#58CC02]' : ''} ${selectedDayStr === day.dateStr ? 'bg-[#58CC02]/90 text-white shadow-lg ring-2 ring-[#58CC02]' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => setSelectedDayStr(day.dateStr)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">{day.dayName}</span>
              <span className="text-2xl font-bold">{day.dayNumber}</span>
            </div>
            
            {/* 任务列表 */}
            <div className="space-y-3 mb-4 flex-grow">
              {state.tasks
                .filter(task => task.date === day.dateStr)
                .map(task => (
                  <motion.div
                    key={task.id}
                    className={`group p-3 rounded-lg ${selectedDayStr === day.dateStr ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id);
                          }}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-[#58CC02] border-[#58CC02]' : 'border-gray-300'} transition-colors`}
                        >
                          {task.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span className={`text-sm truncate ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    {task.startTime && <div className="text-xs opacity-75 mt-1">{task.startTime}</div>}
                  </motion.div>
                ))}
            </div>
            
            {/* 任务进度指示器 */}
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-auto">
              {day.totalTasks > 0 && (
                <motion.div 
                  className="h-full bg-[#58CC02]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.completedTasks / day.totalTasks) * 100}%` }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                />
              )}
            </div>
            
            <div className="mt-2 text-xs text-center">
              {day.completedTasks}/{day.totalTasks} 任务
            </div>
            </motion.div>
            
            {/* 添加任务表单 */}
            {selectedDayStr === day.dateStr && (
              <motion.form 
                className="mt-4"
                onSubmit={handleAddTask}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
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
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        setSelectedDayStr(null);
                        setNewTaskTitle('');
                        setNewTaskTime('');
                        setNewTaskDetails('');
                      }}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;