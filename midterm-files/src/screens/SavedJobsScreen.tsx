import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { Job } from '../types';
import ApplicationFormModal from './ApplicationFormScreen';
import JobDetailsModal from '../components/JobDetailsModal';

const SavedJobsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { savedJobs, removeSavedJob } = useSavedJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState<Job | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filteredJobs = savedJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderJobCard = ({ item }: { item: Job }) => (
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
            style={styles.removeButton}
            onPress={() => removeSavedJob(item.id)}
          >
            <Text style={styles.buttonText}>Remove</Text>
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

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          Available Saved Jobs
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
        placeholder="Search saved jobs..."
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {savedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            No saved jobs yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedJob && (
        <ApplicationFormModal
          visible={showApplicationForm}
          job={selectedJob}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          fromSaved={true}
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
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  detailsButton: {
    padding: 10,
    backgroundColor: '#a47e2d',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#e34536',
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
  darkInput: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  listContainer: {
    paddingVertical: 12,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SavedJobsScreen; 