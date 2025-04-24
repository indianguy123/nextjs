import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async () => {
    const response = await axios.get('/api/inventory'); // <-- now uses Next.js route
    return response.data;
  });
  

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  status: string;
  [key: string]: any;
}

interface InventoryState {
  data: InventoryItem[];
  filter: Record<string, string>;
  sort: { key: string; direction: 'asc' | 'desc' };
  page: number;
  pageSize: number;
}

const initialState: InventoryState = {
  data: [],
  filter: {},
  sort: { key: '', direction: 'asc' },
  page: 1,
  pageSize: 10,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: string; value: string }>) {
      state.filter[action.payload.key] = action.payload.value;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ key: string; direction: 'asc' | 'desc' }>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setFilter, setSort, setPage } = inventorySlice.actions;

export const selectFilteredSortedPaginatedData = (state: { inventory: InventoryState }) => {
  const { data, filter, sort, page, pageSize } = state.inventory;

  const filtered = data
    .map((parent) => {
      // Filter subcomponents
      const filteredSubs = parent.subcomponents?.filter((sub: any) =>
        Object.keys(filter).every((key) =>
          sub[key]?.toString().toLowerCase().includes(filter[key].toLowerCase())
        )
      );

      // Return parent if any subcomponent matched
      if (filteredSubs && filteredSubs.length > 0) {
        return { ...parent, subcomponents: filteredSubs };
      }

      return null; // Skip parent if no match
    })
    .filter(Boolean); // remove nulls

  const sorted = sort.key
    ? [...filtered].sort((a, b) => {
        const valA = a[sort.key];
        const valB = b[sort.key];
        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filtered;

  const start = (page - 1) * pageSize;
  return sorted.slice(start, start + pageSize);
};


export default inventorySlice.reducer;
