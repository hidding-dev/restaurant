export enum CartActionsType {
  ADD_MENU_TO_CART = "ADD_MENU_TO_CART",
  REMOVE_MENU_FROM_CART = "REMOVE_MENU_FROM_CART",
  UPDATE_PRICE = "UPDATE_PRICE",
  GET_MENU_QUANTITY = "GET_MENU_QUANTITY",
  ADD_ITEM_TO_CART = "ADD_ITEM_TO_CART",
  REMOVE_ITEM_FROM_CART = "REMOVE_ITEM_FROM_CART",
  GET_MENU_PRICE = "GET_MENU_PRICE",
  INCREASE_MENU_QUANTITY = "INCREASE_MENU_QUANTITY",
}

export type OrderSummary = {
  menus: Partial<CartItem>[];
  quantity: number;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  maximumPermitted?: number;
};

export type selectedItem = {
  id: string;
  menuId: string;
  name: string;
  quantity?: number | 0;
  price: number;
  menuPrice: number;
};

export type CartItem = {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  items?: Item[];
  menuPrice: number;
  selectedItems?: selectedItem[] | [];
  menuTotalPrice: number;
};

export type CartAction = {
  type: CartActionsType;
};

export const initialCartState: cartState = {
  totalPrice: 0,
  quantity: 0,
  menus: [],
  orderSummary: [],
};

export type cartState = {
  totalPrice: number;
  quantity: number;
  menus: Partial<CartItem>[];
  orderSummary: OrderSummary[];
};

export const cartReducer = (state = initialCartState, action: CartAction): cartState => {
  const { type } = action;
  switch (type) {
    case CartActionsType.ADD_MENU_TO_CART:
      return {
        ...state,
      };
    case CartActionsType.REMOVE_MENU_FROM_CART:
      return {
        ...state,
      };
    case CartActionsType.ADD_ITEM_TO_CART:
      return {
        ...state,
      };
    case CartActionsType.REMOVE_ITEM_FROM_CART:
      return {
        ...state,
      };
    case CartActionsType.GET_MENU_QUANTITY:
      return {
        ...state,
      };
    case CartActionsType.GET_MENU_PRICE:
      return {
        ...state,
      };
    case CartActionsType.INCREASE_MENU_QUANTITY:
      return {
        ...state,
      };
    default:
      throw new Error(`No case for type ${type} found in shopReducer.`);
  }
};