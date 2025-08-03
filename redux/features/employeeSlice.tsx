import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiCall } from '../../app/api/handleApiCall';

// Types based on Swagger schemas
export interface CreateEmployeeDto {
  emp_code: string;
  emp_password: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender?: 'male' | 'female';
  merital_status: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  mobile: string;
  telephone?: string;
  identity_doc: string;
  identity_no: string;
  emp_type: string;
  joining_date: string;
  blood_group: string;
  photo?: string;
  designation: string;
  department: string;
  pan_no: string;
  bank_name: string;
  account_no: string;
  ifsc_code: string;
  pf_account: string;
}

export interface UpdateEmployeeDto {
  id: number;
}

export interface Employee extends CreateEmployeeDto {
  id: number;
}

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
};

// Async thunks
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData: CreateEmployeeDto) => {
    const response = await handleApiCall<Employee>({
      url: '/employees',
      method: 'POST',
      data: employeeData,
    });
    return response;
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAll',
  async () => {
    const response = await handleApiCall<Employee[]>({
      url: '/employees',
      method: 'GET',
    });
    return response;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: string) => {
    const response = await handleApiCall<Employee>({
      url: `/employees/${id}`,
      method: 'GET',
    });
    return response;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: string; data: UpdateEmployeeDto }) => {
    const response = await handleApiCall<Employee>({
      url: `/employees/${id}`,
      method: 'PATCH',
      data,
    });
    return response;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string) => {
    await handleApiCall({
      url: `/employees/${id}`,
      method: 'DELETE',
    });
    return id;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    // Create employee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create employee';
      })
      // Fetch all employees
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee';
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update employee';
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id.toString() !== action.payload);
        if (state.currentEmployee?.id.toString() === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete employee';
      });
  },
});

export const { clearError, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;