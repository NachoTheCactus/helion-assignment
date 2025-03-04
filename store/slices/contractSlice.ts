import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IContractClient, ContractStatus } from '@/types/contract';

export interface ContractState {
  contracts: IContractClient[];
  currentContract: IContractClient | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContractState = {
  contracts: [],
  currentContract: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/contracts');
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (contractData: any, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });
      if (!response.ok) {
        throw new Error('Failed to create contract');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update contract');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const closeContract = createAsyncThunk(
  'contracts/closeContract',
  async ({ id, status }: { id: string; status: ContractStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contracts/${id}/close`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to close contract');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setCurrentContract: (state, action: PayloadAction<IContractClient>) => {
      state.currentContract = action.payload;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts.push(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.contracts.findIndex(
          (contract) => contract._id === action.payload._id
        );
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(closeContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(closeContract.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.contracts.findIndex(
          (contract) => contract._id === action.payload._id
        );
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
      })
      .addCase(closeContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentContract, clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer;