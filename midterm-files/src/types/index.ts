export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  description: string;
  isSaved: boolean;
  jobType?: string;
  workModel?: string;
}

export interface ApplicationForm {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
} 