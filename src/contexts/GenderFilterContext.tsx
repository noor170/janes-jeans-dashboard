import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GenderFilter } from '@/types';

interface GenderFilterContextType {
  genderFilter: GenderFilter;
  setGenderFilter: (filter: GenderFilter) => void;
}

const GenderFilterContext = createContext<GenderFilterContextType | undefined>(undefined);

export const GenderFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('All');

  return (
    <GenderFilterContext.Provider value={{ genderFilter, setGenderFilter }}>
      {children}
    </GenderFilterContext.Provider>
  );
};

export const useGenderFilter = (): GenderFilterContextType => {
  const context = useContext(GenderFilterContext);
  if (!context) {
    throw new Error('useGenderFilter must be used within a GenderFilterProvider');
  }
  return context;
};
