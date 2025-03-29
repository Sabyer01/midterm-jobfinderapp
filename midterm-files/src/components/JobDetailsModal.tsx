import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../types';

interface JobDetailsModalProps {
  visible: boolean;
  job: Job;
  onClose: () => void;
}

const JobDetailsModal = ({ visible, job, onClose }: JobDetailsModalProps) => {
  const { isDarkMode } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (visible) {
      // Add a small delay to ensure theme is stable
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [visible]);

  if (!isReady) {
    return null;
  }

  const cleanAndTruncateDescription = (description: string) => {
    // Remove HTML tags
    const cleanText = description.replace(/<[^>]*>/g, '');
    
    // Split into sentences and filter empty ones
    const sentences = cleanText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    // Take only the first 10 sentences
    const limitedSentences = sentences.slice(0, Math.min(10, sentences.length));
    
    // Join sentences back together
    return limitedSentences.map(sentence => sentence.trim() + '.').join(' ');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <View style={styles.container}>
        <View style={[styles.modalView, isDarkMode && styles.darkModalView]}>
          <View style={styles.header}>
            <View style={styles.companyLogoContainer}>
              <Text style={styles.companyLogo}>🏢</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, isDarkMode && styles.darkCloseButtonText]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.jobTitle, isDarkMode && styles.darkText]}>
            {job.title}
          </Text>
          <Text style={[styles.companyName, isDarkMode && styles.darkText]}>
            {job.company}
          </Text>

          <View style={[styles.detailsContainer, isDarkMode && styles.darkDetailsContainer]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>Job Type:</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                {job.jobType || 'Full Time'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>Work Model:</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                {job.workModel || 'Hybrid'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>Salary Range:</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                {job.salary}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>Location:</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                {job.location}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle, isDarkMode && styles.darkText]}>
              Description
            </Text>
            <ScrollView style={styles.descriptionScroll}>
              <Text style={[styles.descriptionText, isDarkMode && styles.darkText]}>
                {cleanAndTruncateDescription(job.description)}
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkModalView: {
    backgroundColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  companyLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogo: {
    fontSize: 30,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  darkCloseButtonText: {
    color: '#999',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  darkDetailsContainer: {
    backgroundColor: '#3a3a3a',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
  },
  descriptionContainer: {
    height: 300,
    marginBottom: 20,
  },
  descriptionScroll: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
  },
  darkText: {
    color: '#fff',
  },
});

export default JobDetailsModal; 