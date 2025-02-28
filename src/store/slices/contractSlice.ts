import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contract, ContractStatus } from '../../types';
import { contractApi } from '../../api/contractApi';
import { updateOfferStatusAsync } from './offerSlice';

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (_, { rejectWithValue }) => {
    try {
      return await contractApi.getAllContracts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch contracts');
    }
  }
);

export const fetchContractsByStatus = createAsyncThunk(
  'contracts/fetchContractsByStatus',
  async (status: ContractStatus, { rejectWithValue }) => {
    try {
      return await contractApi.getContractsByStatus(status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch contracts by status');
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await contractApi.getContractById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch contract');
    }
  }
);

export const createContractAsync = createAsyncThunk(
  'contracts/createContract',
  async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await contractApi.createContract(contractData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create contract');
    }
  }
);

export const createContractFromOfferAsync = createAsyncThunk(
  'contracts/createContractFromOffer',
  async (
    { offer, offerId }: { offer: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>; offerId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Create contract from offer
      const contract = await contractApi.createContractFromOffer(offer, offerId);
      
      // Update offer status to Accepted
      await dispatch(updateOfferStatusAsync({ id: offerId, status: 'Accepted' }));
      
      return contract;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create contract from offer');
    }
  }
);

export const updateContractAsync = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, contract }: { id: string; contract: Partial<Contract> }, { rejectWithValue }) => {
    try {
      return await contractApi.updateContract(id, contract);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update contract');
    }
  }
);

export const updateContractStatusAsync = createAsyncThunk(
  'contracts/updateContractStatus',
  async ({ id, status }: { id: string; status: ContractStatus }, { rejectWithValue }) => {
    try {
      return await contractApi.updateContractStatus(id, status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update contract status');
    }
  }
);

export const closeContractAsync = createAsyncThunk(
  'contracts/closeContract',
  async (id: string, { rejectWithValue }) => {
    try {
      return await contractApi.closeContract(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to close contract');
    }
  }
);

export const deleteContractAsync = createAsyncThunk(
  'contracts/deleteContract',
  async (id: string, { rejectWithValue }) => {
    try {
      await contractApi.deleteContract(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete contract');
    }
  }
);

// Interface for state
export interface ContractState {
  contracts: Contract[];
  currentContract: Contract | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ContractState = {
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
};

// Slice
const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    // Original reducers for backwards compatibility with existing code
    createContract: (state, action: PayloadAction<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous createContract action. Use createContractAsync instead.');
    },
    createContractFromOffer: (state, action: PayloadAction<{ 
      offer: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>, 
      offerId: string 
    }>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous createContractFromOffer action. Use createContractFromOfferAsync instead.');
    },
    updateContract: (state, action: PayloadAction<{ id: string; contract: Partial<Contract> }>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous updateContract action. Use updateContractAsync instead.');
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous deleteContract action. Use deleteContractAsync instead.');
    },
    closeContract: (state, action: PayloadAction<string>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous closeContract action. Use closeContractAsync instead.');
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all contracts
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.contracts = action.payload;
        state.loading = false;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch contracts by status
    builder
      .addCase(fetchContractsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractsByStatus.fulfilled, (state, action) => {
        state.contracts = action.payload;
        state.loading = false;
      })
      .addCase(fetchContractsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch contract by id
    builder
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.currentContract = action.payload;
        state.loading = false;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create contract
    builder
      .addCase(createContractAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContractAsync.fulfilled, (state, action) => {
        state.contracts.push(action.payload);
        state.loading = false;
      })
      .addCase(createContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create contract from offer
    builder
      .addCase(createContractFromOfferAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContractFromOfferAsync.fulfilled, (state, action) => {
        state.contracts.push(action.payload);
        state.loading = false;
      })
      .addCase(createContractFromOfferAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update contract
    builder
      .addCase(updateContractAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractAsync.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((contract) => contract.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
        state.loading = false;
      })
      .addCase(updateContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update contract status
    builder
      .addCase(updateContractStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatusAsync.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((contract) => contract.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
        state.loading = false;
      })
      .addCase(updateContractStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Close contract
    builder
      .addCase(closeContractAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeContractAsync.fulfilled, (state, action) => {
        const index = state.contracts.findIndex((contract) => contract.id === action.payload.id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
        state.loading = false;
      })
      .addCase(closeContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Delete contract
    builder
      .addCase(deleteContractAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContractAsync.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter((contract) => contract.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteContractAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetError, 
  createContract, 
  createContractFromOffer, 
  updateContract, 
  deleteContract, 
  closeContract 
} = contractSlice.actions;

export default contractSlice.reducer;