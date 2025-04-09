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
    
    return daysLeft;
  };
  
  const remainingDays = getRemainingDays();
  const isExpired = remainingDays === 0; // 只在目标当天显示结束状态
  const isCompleted = false;


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

      {/* 倒计时目标不需要进度显示和打卡按钮 */}
    </motion.div>
  );
};

export default CountdownGoalCard;