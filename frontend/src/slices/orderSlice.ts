import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types for state
interface Address {
  street: string;
  city: string;
  county: string;
  country: string;
  state: string;
  pincode: string;
}

interface Product {
  name: string;
  unitPrice: number;
  quantity: number;
  category: string;
}

interface Dimensions {
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface OrderState {
  orderId: string;
  orderDate: string;
  sourceAddress: Address;
  destinationAddress: Address;
  products: Product[];
  dimensions: Dimensions;
  selectedShippingOption: ShippingOption | null;
}
type ShippingOption = {
  id: string;
  company: string;
  mode: "air" | "water" | "road" | "air+water" | "air+road" | "water+road";
  price: number;
  pickupTime: string;
  deliveryTime: string;
  rating: number;
};

// Initial state
const initialState: OrderState = {
  orderId: `ORD-${Date.now()}`,
  orderDate: new Date().toISOString().split("T")[0],
  sourceAddress: {
    street: "",
    city: "",
    county: "",
    country: "",
    state: "",
    pincode: "",
  },
  destinationAddress: {
    street: "",
    city: "",
    county: "",
    country: "",
    state: "",
    pincode: "",
  },
  products: [{ name: "", unitPrice: 0, quantity: 0, category: "" }],
  dimensions: { weight: 0, length: 0, width: 0, height: 0 },
  selectedShippingOption: null,
};

// Slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    updateOrderDate: (state, action: PayloadAction<string>) => {
      state.orderDate = action.payload;
    },
    updateSourceAddress: (
      state,
      action: PayloadAction<{ field: keyof Address; value: string }>
    ) => {
      state.sourceAddress[action.payload.field] = action.payload.value;
    },
    updateDestinationAddress: (
      state,
      action: PayloadAction<{ field: keyof Address; value: string }>
    ) => {
      state.destinationAddress[action.payload.field] = action.payload.value;
    },
    addProduct: (state) => {
      state.products.push({
        name: "",
        unitPrice: 0,
        quantity: 0,
        category: "",
      });
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
    },
    updateProduct: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Product;
        value: string | number;
      }>
    ) => {
      const { index, field, value } = action.payload;
    
      // Type check to ensure value matches the expected type of the field
      if (field === 'name' || field === 'category') {
        if (typeof value === 'string') {
          state.products[index][field] = value;
        } else {
          throw new Error(`Invalid type: ${field} must be a string`);
        }
      } else if (field === 'unitPrice' || field === 'quantity') {
        if (typeof value === 'number') {
          state.products[index][field] = value;
        } else {
          throw new Error(`Invalid type: ${field} must be a number`);
        }
      }
    },
    updatePackageDimensions: (
      state,
      action: PayloadAction<{ field: keyof Dimensions; value: number }>
    ) => {
      state.dimensions[action.payload.field] = action.payload.value;
    },
    setSelectedShippingOption(state, action: PayloadAction<ShippingOption>) {
        state.selectedShippingOption = action.payload
      },
  },
});

// Export actions and reducer
export const {
  updateOrderId,
  updateOrderDate,
  updateSourceAddress,
  updateDestinationAddress,
  addProduct,
  removeProduct,
  updateProduct,
  updatePackageDimensions,
  setSelectedShippingOption,
} = orderSlice.actions;

export default orderSlice.reducer;
