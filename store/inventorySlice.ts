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
  subcomponents?: Array<Record<string, string | number>>; // Define subcomponents as an array of objects
  [key: string]: string | number | undefined | Array<Record<string, string | number>>;
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

  const filtered = data.filter((row) =>
    Object.keys(filter).every((key) => {
      const value = row[key];
      const search = filter[key];
      if (value === undefined || value === null) return false;
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
      ) || (
        typeof value === "number" &&
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    })
  );
  

  const sorted = sort.key
    ? [...filtered].sort((a, b) => {
        if (!a || !b) return 0; // Ensure a and b are not null
        const valA = a[sort.key as keyof typeof a];
        const valB = b[sort.key as keyof typeof b];
        if ((valA ?? '') < (valB ?? '')) return sort.direction === 'asc' ? -1 : 1;
        if ((valA ?? '') > (valB ?? '')) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filtered;

  const start = (page - 1) * pageSize;
  return sorted.slice(start, start + pageSize);
};


export default inventorySlice.reducer;
