import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ApplicationForm, Job } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ApplicationFormModalProps {
  visible: boolean;
  job: Job;
  onClose: () => void;
  fromSaved?: boolean;
}

const ApplicationFormModal = ({ visible, job, onClose, fromSaved }: ApplicationFormModalProps) => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isReady, setIsReady] = useState(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    name: '',
    email: '',
    contactNumber: '',
    whyHireYou: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!validatePhoneNumber(formData.contactNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.whyHireYou.trim()) {
      Alert.alert('Error', 'Please enter why we should hire you');
      return;
    }
    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      whyHireYou: '',
    });
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      whyHireYou: '',
    });
    onClose();
    if (fromSaved) {
      // Add a small delay before navigation to ensure modal is closed
      setTimeout(() => {
        navigation.navigate('MainTabs', { screen: 'Job Finder' });
      }, 100);
    }
  };

  const handleWhyHireYouChange = (text: string) => {
    const words = text.split(/\s+/);
    if (words.length <= 200) {
      setFormData({ ...formData, whyHireYou: text });
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, isDarkMode && styles.darkModalView]}>
              <View style={styles.header}>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>
                  Apply for Job
                </Text>
                <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
                  <Text style={[styles.closeButtonText, isDarkMode && styles.darkCloseButtonText]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.jobInfo, isDarkMode && styles.darkJobInfo]}>
                <Text style={[styles.jobTitle, isDarkMode && styles.darkText]}>
                  {job.title}
                </Text>
                <Text style={[styles.jobCompany, isDarkMode && styles.darkText]}>
                  {job.company}
                </Text>
              </View>

              <View style={styles.form}>
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Full Name"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Email"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
                <TextInput
                  style={[styles.input, isDarkMode && styles.darkInput]}
                  placeholder="Contact Number"
                  placeholderTextColor={isDarkMode ? '#888' : '#666'}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={formData.contactNumber}
                  onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
                />
                <View style={styles.textAreaContainer}>
                  <Text style={[styles.textAreaLabel, isDarkMode && styles.darkText]}>
                    Why should we hire you? (max 200 words)
                  </Text>
                  <ScrollView style={styles.textAreaScroll}>
                    <TextInput
                      style={[styles.textArea, isDarkMode && styles.darkInput]}
                      placeholder="Enter your message here..."
                      placeholderTextColor={isDarkMode ? '#888' : '#666'}
                      multiline
                      value={formData.whyHireYou}
                      onChangeText={handleWhyHireYouChange}
                    />
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="none"
      >
        <View style={styles.successModalContainer}>
          <View style={[styles.successModalContent, isDarkMode && styles.darkSuccessModalContent]}>
            <Text style={[styles.successModalText, isDarkMode && styles.darkText]}>
              Application submitted successfully!
            </Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.successModalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
  darkText: {
    color: '#fff',
  },
  darkCloseButtonText: {
    color: '#999',
  },
  jobInfo: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  darkJobInfo: {
    backgroundColor: '#3a3a3a',
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
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#3a3a3a',
    color: '#fff',
  },
  textAreaContainer: {
    height: 150,
    marginBottom: 16,
  },
  textAreaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textAreaScroll: {
    flex: 1,
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#04603f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  darkSuccessModalContent: {
    backgroundColor: '#2a2a2a',
  },
  successModalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  successModalButton: {
    backgroundColor: '#04603f',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  successModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationFormModal; 