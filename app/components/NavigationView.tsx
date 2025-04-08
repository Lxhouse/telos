'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavigationCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, icon, onClick }) => (
  <motion.button
    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="text-[#58CC02] mb-3">{icon}</div>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </motion.button>
);

const NavigationView: React.FC = () => {
  const handleHistoryClick = () => {
    // 处理历史任务点击
    console.log('历史任务');
  };

  const handleSettingsClick = () => {
    // 处理设置点击
    console.log('设置');
  };

  return (
    <div className="p-6">
      <motion.h2
        className="text-xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        功能导航
      </motion.h2>

      <div className="grid grid-cols-2 gap-4">
        <NavigationCard
          title="历史任务"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          onClick={handleHistoryClick}
        />
        <NavigationCard
          title="设置"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          onClick={handleSettingsClick}
        />
      </div>
    </div>
  );
};

export default NavigationView;