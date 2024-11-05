import { CREATE_ORDER, FETCH_ORDER, FETCH_ORDERS } from "../actions/orderAction";

const intitalState = {
    orders: [],
}

const ordersReducer = (state = intitalState, action) => {
    switch (action.type) {
        case CREATE_ORDER:
            return { ...state, orders: [...state.orders, action.payload] };
        case FETCH_ORDER:
            return { ...state, order: action.payload };
        case FETCH_ORDERS:
            return { ...state, adminOrders: action.payload };    
        default:
            return state;
    }
}

export default ordersReducer;
