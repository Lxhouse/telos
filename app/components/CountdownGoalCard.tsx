'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { Goal } from '../types';
import { useAppContext } from '../context/AppContext';

interface CountdownGoalCardProps {
  goal: Goal;
}

const CountdownGoalCard: React.FC<CountdownGoalCardProps> = ({ goal }) => {
  const { incrementGoalCount } = useAppContext();

  // 计算剩余天数
  const getRemainingDays = () => {
    if (!goal.deadline) return 0;
    
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const daysLeft = differenceInDays(deadlineDate, today);
    
    return daysLeft > 0 ? daysLeft : 0;
  };
  
  const remainingDays = getRemainingDays();
  const isExpired = remainingDays === 0;
  const progressPercentage = (goal.currentCount / goal.targetCount) * 100;
  const isCompleted = progressPercentage >= 100;

  // 处理打卡
  const handleCheckin = async () => {
    try {
      await incrementGoalCount(goal.id);
    } catch (error) {
      console.error('打卡失败:', error);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow p-4 mb-4 transform transition-all duration-300 relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      layout
    >
      {/* 倒计时显示 */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {isExpired ? '已结束' : `${remainingDays}天`}
        </div>
      </div>

      <h3 className="font-bold text-lg mb-3 text-gray-800 pr-24">
        <span className="truncate block">{goal.title}</span>
      </h3>

      {/* 进度显示 */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            完成进度 {goal.currentCount} / {goal.targetCount}
          </span>
          <span className="text-sm font-medium" style={{ color: isCompleted ? '#58CC02' : '#FF4B4B' }}>
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="overflow-hidden h-2 rounded-full bg-gray-100">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: isCompleted ? '#58CC02' : '#FF4B4B' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* 打卡按钮 */}
      {!isCompleted && !isExpired && (
        <button
          onClick={handleCheckin}
          className="w-full bg-[#FF4B4B] text-white py-2 rounded-lg font-medium hover:bg-[#ff3333] transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          打卡
        </button>
      )}
    </motion.div>
  );
};

export default CountdownGoalCard;