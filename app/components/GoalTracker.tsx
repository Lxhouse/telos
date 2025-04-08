'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoalCard from './GoalCard';
import { useAppContext } from '../context/AppContext';

const GoalTracker: React.FC = () => {
  const { state, addGoal } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetCount: 1,
    deadline: '',
    color: '#58CC02' // 多邻国绿色作为默认颜色
  });
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: name === 'targetCount' ? parseInt(value) || 1 : value
    }));
  };
  
  // 处理添加新目标
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      addGoal(
        newGoal.title.trim(),
        newGoal.targetCount,
        newGoal.deadline || undefined,
        newGoal.color
      );
      // 重置表单
      setNewGoal({
        title: '',
        targetCount: 1,
        deadline: '',
        color: '#58CC02'
      });
      setShowForm(false);
    }
  };
  
  // 可选的颜色列表
  const colorOptions = [
    '#58CC02', // 多邻国绿色
    '#FF4B4B', // 红色
    '#1CB0F6', // 蓝色
    '#FFDE59', // 黄色
    '#FF9600', // 橙色
    '#8549BA'  // 紫色
  ];
  
  return (
    <div className="p-4">
      <motion.h2 
        className="text-xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        目标追踪
      </motion.h2>
      
      {/* 添加目标按钮 */}
      {!showForm && (
        <motion.button
          className="w-full bg-[#58CC02] text-white py-3 rounded-lg font-medium mb-6 shadow-sm hover:bg-[#46a302] transition-colors"
          onClick={() => setShowForm(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          添加新目标
        </motion.button>
      )}
      
      {/* 添加目标表单 */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className="bg-white rounded-lg shadow-sm p-4 mb-6"
            onSubmit={handleAddGoal}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标名称
              </label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                placeholder="例如：每周跑步3次"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标次数
              </label>
              <input
                type="number"
                name="targetCount"
                value={newGoal.targetCount}
                onChange={handleInputChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                截止日期（可选）
              </label>
              <input
                type="date"
                name="deadline"
                value={newGoal.deadline}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                颜色
              </label>
              <div className="flex space-x-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-[#58CC02] text-white py-2 rounded-md font-medium hover:bg-[#46a302] transition-colors"
              >
                保存
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setShowForm(false)}
              >
                取消
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* 目标列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {state.goals.length > 0 ? (
            state.goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))
          ) : (
            <motion.div
              className="text-center py-8 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              还没有添加目标，点击上方按钮添加一个吧！
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GoalTracker;