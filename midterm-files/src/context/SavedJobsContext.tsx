import React, { createContext, useState, useContext } from 'react';
import { Job } from '../types';

interface SavedJobsContextType {
  savedJobs: Job[];
  addSavedJob: (job: Job) => void;
  removeSavedJob: (jobId: string) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType>({} as SavedJobsContextType);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const addSavedJob = (job: Job) => {
    if (!savedJobs.some(savedJob => savedJob.id === job.id)) {
      setSavedJobs([...savedJobs, { ...job, isSaved: true }]);
    }
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, addSavedJob, removeSavedJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext); 