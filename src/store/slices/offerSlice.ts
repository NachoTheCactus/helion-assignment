import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Offer, OfferStatus } from '../../types';
import { offerApi } from '../../api/offerApi';

// Async thunks
export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async (_, { rejectWithValue }) => {
    try {
      return await offerApi.getAllOffers();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch offers');
    }
  }
);

export const fetchOffersByStatus = createAsyncThunk(
  'offers/fetchOffersByStatus',
  async (status: OfferStatus, { rejectWithValue }) => {
    try {
      return await offerApi.getOffersByStatus(status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch offers by status');
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  'offers/fetchOfferById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await offerApi.getOfferById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch offer');
    }
  }
);

export const createOfferAsync = createAsyncThunk(
  'offers/createOffer',
  async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await offerApi.createOffer(offerData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create offer');
    }
  }
);

export const updateOfferAsync = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, offer }: { id: string; offer: Partial<Offer> }, { rejectWithValue }) => {
    try {
      return await offerApi.updateOffer(id, offer);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update offer');
    }
  }
);

export const updateOfferStatusAsync = createAsyncThunk(
  'offers/updateOfferStatus',
  async ({ id, status }: { id: string; status: OfferStatus }, { rejectWithValue }) => {
    try {
      return await offerApi.updateOfferStatus(id, status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update offer status');
    }
  }
);

export const deleteOfferAsync = createAsyncThunk(
  'offers/deleteOffer',
  async (id: string, { rejectWithValue }) => {
    try {
      await offerApi.deleteOffer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete offer');
    }
  }
);

// Interface for state
export interface OfferState {
  offers: Offer[];
  currentOffer: Offer | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OfferState = {
  offers: [],
  currentOffer: null,
  loading: false,
  error: null,
};

// Slice
const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    // Original reducers for backwards compatibility with existing code
    createOffer: (state, action: PayloadAction<Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous createOffer action. Use createOfferAsync instead.');
    },
    updateOffer: (state, action: PayloadAction<{ id: string; offer: Partial<Offer> }>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous updateOffer action. Use updateOfferAsync instead.');
    },
    deleteOffer: (state, action: PayloadAction<string>) => {
      // This is now handled by the async thunk, but kept for compatibility
      console.warn('Using deprecated synchronous deleteOffer action. Use deleteOfferAsync instead.');
    },
    convertOfferToContract: (state, action: PayloadAction<string>) => {
      // This is now handled by the contract slice and async thunks, but kept for compatibility
      console.warn('Using deprecated synchronous convertOfferToContract action. Use updateOfferStatusAsync instead.');
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all offers
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.loading = false;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch offers by status
    builder
      .addCase(fetchOffersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffersByStatus.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.loading = false;
      })
      .addCase(fetchOffersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch offer by id
    builder
      .addCase(fetchOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.loading = false;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create offer
    builder
      .addCase(createOfferAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOfferAsync.fulfilled, (state, action) => {
        state.offers.push(action.payload);
        state.loading = false;
      })
      .addCase(createOfferAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update offer
    builder
      .addCase(updateOfferAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOfferAsync.fulfilled, (state, action) => {
        const index = state.offers.findIndex((offer) => offer.id === action.payload.id);
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
        state.currentOffer = action.payload;
        state.loading = false;
      })
      .addCase(updateOfferAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update offer status
    builder
      .addCase(updateOfferStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOfferStatusAsync.fulfilled, (state, action) => {
        const index = state.offers.findIndex((offer) => offer.id === action.payload.id);
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
        state.currentOffer = action.payload;
        state.loading = false;
      })
      .addCase(updateOfferStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Delete offer
    builder
      .addCase(deleteOfferAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOfferAsync.fulfilled, (state, action) => {
        state.offers = state.offers.filter((offer) => offer.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteOfferAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError, createOffer, updateOffer, deleteOffer, convertOfferToContract } = offerSlice.actions;

export default offerSlice.reducer;