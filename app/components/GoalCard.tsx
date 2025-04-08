'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  // 计算进度百分比
  const progressPercentage = (goal.currentCount / goal.targetCount) * 100;
  
  // 计算剩余天数（如果有截止日期）
  const getRemainingDays = () => {
    if (!goal.deadline) return null;
    
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const daysLeft = differenceInDays(deadlineDate, today);
    
    return daysLeft > 0 ? daysLeft : 0;
  };
  
  const remainingDays = getRemainingDays();
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      style={{ borderLeft: `4px solid ${goal.color}` }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      layout
    >
      <h3 className="font-bold text-lg mb-2">{goal.title}</h3>
      
      {/* 进度指示器 */}
      <div className="relative pt-1 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold inline-block text-gray-600">
            进度: {goal.currentCount}/{goal.targetCount}
          </span>
          <span className="text-xs font-semibold inline-block text-gray-600">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <motion.div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* 环形进度条 */}
      <div className="flex items-center justify-between">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* 背景圆环 */}
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            {/* 进度圆环 */}
            <motion.circle
              className="text-[#58CC02]"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              initial={{ strokeDasharray: 251.2, strokeDashoffset: 251.2 }}
              animate={{ 
                strokeDashoffset: 251.2 - (progressPercentage / 100) * 251.2 
              }}
              transition={{ duration: 1 }}
            />
            {/* 中间的文字 */}
            <text
              x="50"
              y="50"
              dy=".3em"
              textAnchor="middle"
              className="text-xs font-medium fill-current text-gray-800"
            >
              {`${goal.currentCount}/${goal.targetCount}`}
            </text>
          </svg>
        </div>
        
        {remainingDays !== null && (
          <div className="text-right">
            <span className="text-xs text-gray-500">剩余时间</span>
            <p className="text-lg font-bold">{remainingDays} 天</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalCard;