'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoalCard from './GoalCard';
import { useAppContext } from '../context/AppContext';
import { GoalType } from '../types';
import CountdownGoalCard from './CountdownGoalCard';

const GoalTracker: React.FC = () => {
  const { state, addGoal } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: GoalType.CHECKIN,
    targetCount: 1,
    deadline: ''
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
      addGoal({
        title: newGoal.title.trim(),
        type: newGoal.type,
        targetCount: newGoal.targetCount,
        currentCount: 0,
        deadline: newGoal.deadline || undefined,
        color: newGoal.type === GoalType.CHECKIN ? '#58CC02' : '#FF4B4B',
        lastUpdate: new Date().toISOString()
      });
      // 重置表单
      setNewGoal({
        title: '',
        type: 'checkin' as GoalType,
        targetCount: 1,
        deadline: '',

      });
      setShowForm(false);
    }
  };
  
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
      
      {/* 目标列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {state.goals && state.goals.length > 0 ? (
            [...state.goals].reverse().map((goal) => (
              goal.type === GoalType.CHECKIN ? (
                <GoalCard 
                  key={goal.id} 
                  goal={goal}
                />
              ) : (
                <CountdownGoalCard 
                  key={goal.id} 
                  goal={goal}
                />
              )
            ))
          ) : (
            <motion.div
              className="text-center py-8 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              还没有添加目标，开始添加一个吧！
            </motion.div>
          )}
        </AnimatePresence>

        {/* 添加目标表单 */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              className="bg-white rounded-lg shadow-sm p-4"
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
                  placeholder="输入你的目标"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border ${newGoal.type === GoalType.CHECKIN ? 'border-[#58CC02] bg-[#58CC02]/10 text-[#58CC02]' : 'border-gray-200 hover:border-gray-300'} transition-colors`}
                    onClick={() => setNewGoal(prev => ({ ...prev, type: GoalType.CHECKIN }))}
                  >
                    <div className="font-medium">打卡式</div>
                    <div className="text-sm text-gray-500">记录每次完成情况</div>
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border ${newGoal.type === GoalType.COUNTDOWN ? 'border-[#FF4B4B] bg-[#FF4B4B]/10 text-[#FF4B4B]' : 'border-gray-200 hover:border-gray-300'} transition-colors`}
                    onClick={() => setNewGoal(prev => ({ ...prev, type: GoalType.COUNTDOWN }))}
                  >
                    <div className="font-medium">倒计时</div>
                    <div className="text-sm text-gray-500">设定截止时间</div>
                  </button>
                </div>
              </div>

              {newGoal.type === GoalType.CHECKIN && (
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
              )}
              
              {newGoal.type === GoalType.COUNTDOWN && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={newGoal.deadline}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58CC02]"
                    required
                  />
                </div>
              )}
              
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

        {/* 添加目标按钮 */}
        {!showForm && (
          <motion.button
            className="w-full bg-[#58CC02] text-white py-3 rounded-lg font-medium shadow-sm hover:bg-[#46a302] transition-colors"
            onClick={() => setShowForm(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            添加新目标
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;