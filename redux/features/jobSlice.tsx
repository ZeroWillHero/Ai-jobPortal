import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiCall } from '../../app/api/handleApiCall';

// Types based on Swagger schemas and API response
export interface CreateJobsDto {
  job_title: string;
  description: string;
  cv_score?: number;
  quiz_score?: number;
}

export interface Job {
  id: number;
  job_title: string;
  description: string;
  cv_score: number;
  quiz_score: number;
  created_at: string;
}

// API Response wrapper
interface JobsApiResponse {
  message: string;
  data: Job[];
}

interface JobApiResponse {
  message: string;
  data: Job;
}

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

// Async thunks
export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData: CreateJobsDto, { rejectWithValue }) => {
    try {
      const response = await handleApiCall<JobApiResponse>({
        url: '/jobs',
        method: 'POST',
        data: jobData,
      });
      return response.data; // Return the job data from the response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (search: string, { rejectWithValue }) => {
    try {
      console.log('Fetching jobs with search:', search);
      const response = await handleApiCall<JobsApiResponse>({
        url: '/jobs',
        method: 'GET',
        params: { search },
      });
      console.log('Jobs API response:', response);
      return response.data; // Return the jobs array from response.data
    } catch (error: any) {
      console.error('Jobs API error:', error);
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await handleApiCall<JobApiResponse>({
        url: `/jobs/${id}`,
        method: 'GET',
      });
      return response.data; // Return the job data from the response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Create job
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create job';
      })
      // Fetch all jobs
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Fetch jobs pending...');
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch jobs fulfilled with payload:', action.payload);
        state.jobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch jobs';
        state.jobs = [];
        console.log('Fetch jobs rejected with error:', action.payload);
      })
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch job';
      });
  },
});

export const { clearError, clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;
