import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { Job } from '../types';
import ApplicationFormModal from './ApplicationFormScreen';
import uuid from 'react-native-uuid';
import axios from 'axios';
import JobDetailsModal from '../components/JobDetailsModal';

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const SAMPLE_JOBS = [
  {
    id: generateId(),
    title: 'Senior React Native Developer',
    company: 'Tech Corp',
    salary: '$120,000 - $150,000',
    location: 'Remote',
    description: 'Looking for an experienced React Native developer...',
    isSaved: false
  },
  {
    id: generateId(),
    title: 'Frontend Developer',
    company: 'Digital Solutions',
    salary: '$90,000 - $110,000',
    location: 'New York',
    description: 'Join our dynamic team...',
    isSaved: false
  },
  {
    id: generateId(),
    title: 'Mobile App Developer',
    company: 'Innovation Labs',
    salary: '$95,000 - $120,000',
    location: 'San Francisco',
    description: 'Building next-gen mobile applications...',
    isSaved: false
  }
];

interface JobData {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  description: string;
  isSaved: boolean;
}

const JobFinderScreen = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const { savedJobs, addSavedJob, removeSavedJob } = useSavedJobs();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState<Job | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://empllo.com/api/v1');
      const jobsArray = Array.isArray(response.data) ? response.data : 
                       response.data.jobs || response.data.data || [];

      if (jobsArray.length > 0) {
        const jobsData = jobsArray.map((job: any) => ({
          id: uuid.v4().toString(),
          title: job.title,
          company: job.company?.name || job.company || 'Company Not Listed',
          salary: job.salary_range || job.salary || 'Salary Not Disclosed',
          location: job.location || 'Location Not Specified',
          description: job.description,
          jobType: job.type || job.job_type,
          workModel: job.work_model || job.workModel,
          isSaved: false
        }));
        setJobs(jobsData);
      } else {
        setJobs(SAMPLE_JOBS);
        setError('No jobs found, showing sample data');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs, showing sample data');
      setJobs(SAMPLE_JOBS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setJobs(prevJobs => 
      prevJobs.map(job => ({
        ...job,
        isSaved: savedJobs.some(savedJob => savedJob.id === job.id)
      }))
    );
  }, [savedJobs]);

  const handleSaveJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      addSavedJob(job);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isSaved: true } : job
      ));
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderJobCard = ({ item }: { item: JobData }) => (
    <View style={[styles.jobCard, isDarkMode && styles.darkJobCard]}>
      <Text style={[styles.jobTitle, isDarkMode && styles.darkText]}>
        {item.title}
      </Text>
      <Text style={[styles.jobCompany, isDarkMode && styles.darkText]}>
        {item.company}
      </Text>
      <Text style={[styles.jobLocation, isDarkMode && styles.darkText]}>
        {item.location}
      </Text>
      <Text style={styles.jobSalary}>
        {item.salary}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              setSelectedJobDetails(item);
              setShowDetailsModal(true);
            }}
          >
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, item.isSaved && styles.savedButtonStyle]}
            onPress={() => handleSaveJob(item.id)}
            disabled={item.isSaved}
          >
            <Text style={styles.buttonText}>
              {item.isSaved ? 'Saved' : 'Save Job'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            setSelectedJob(item);
            setShowApplicationForm(true);
          }}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          Available Jobs
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.circleButton, isDarkMode && styles.darkCircleButton]}
            onPress={scrollToTop}
          >
            <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#272829' }]}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.circleButton, isDarkMode && styles.darkCircleButton]}
            onPress={toggleTheme}
          >
            <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#272829' }]}>
              {isDarkMode ? '◉' : '☾'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={[styles.searchBar, isDarkMode && styles.darkInput]}
        placeholder="Search jobs..."
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        ref={flatListRef}
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {selectedJob && (
        <ApplicationFormModal
          visible={showApplicationForm}
          job={selectedJob}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
        />
      )}

      {selectedJobDetails && (
        <JobDetailsModal
          visible={showDetailsModal}
          job={selectedJobDetails}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedJobDetails(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 19,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  darkCircleButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    marginHorizontal: 22,
    marginTop: 8,
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  jobCard: {
    marginHorizontal: 22,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkJobCard: {
    backgroundColor: '#2d2d2d',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  jobCompany: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  jobSalary: {
    fontSize: 16,
    color: '#a47e2d',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 8,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#04603f',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  savedButtonStyle: {
    backgroundColor: '#b3b3b3',
  },
  detailsButton: {
    padding: 10,
    backgroundColor: '#a47e2d',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    padding: 10,
    backgroundColor: '#04603f',
    borderRadius: 6,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 20,
  },
  darkInput: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff5252',
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 12,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default JobFinderScreen; 