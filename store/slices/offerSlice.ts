import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IOfferClient, OfferStatus } from '@/types/offer';

export interface OfferState {
  offers: IOfferClient[];
  currentOffer: IOfferClient | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  currentOffer: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOffer = createAsyncThunk(
    'offers/createOffer',
    async (offerData: any, { rejectWithValue }) => {
      try {
        const response = await fetch('/api/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offerData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error: any) {
        console.error('Error creating offer:', error);
        return rejectWithValue(error.message || 'Failed to create offer');
      }
    }
  );

export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update offer');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const convertOfferToContract = createAsyncThunk(
  'offers/convertToContract',
  async (offerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to convert offer to contract');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setCurrentOffer: (state, action: PayloadAction<IOfferClient>) => {
      state.currentOffer = action.payload;
    },
    clearCurrentOffer: (state) => {
      state.currentOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers.push(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.offers.findIndex(
          (offer) => offer._id === action.payload._id
        );
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
        state.currentOffer = action.payload;
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(convertOfferToContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(convertOfferToContract.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.offers.findIndex(
          (offer) => offer._id === action.payload.offer._id
        );
        if (index !== -1) {
          state.offers[index] = action.payload.offer;
        }
      })
      .addCase(convertOfferToContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentOffer, clearCurrentOffer } = offerSlice.actions;
export default offerSlice.reducer;