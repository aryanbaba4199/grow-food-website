import { GET_PRODUCTS, GET_SUBCATEGORY, ADD_PRODUCT, GET_BRANDS, GET_CATEGORY, GET_PRODUCT, GET_UNIT,
  GET_BRANDS_PRODUCT, GET_CATEGORY_PRODUCT
 } from '../actions/productActions';

const initialState = {
  products: [],
  brands: [],
  categories: [],
  units : [],
  brandsProduct: [],
  categoryProduct : [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: action.payload };
    case GET_PRODUCT:
      return { ...state, products: action.payload };  
    case ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case GET_BRANDS:
      return { ...state, brands: action.payload };
    case GET_SUBCATEGORY:
      return { ...state, subCategories : action.payload };
      case GET_CATEGORY:
      return { ...state, categories: action.payload };
    case GET_UNIT:
      return { ...state, units: action.payload };  
    case GET_BRANDS_PRODUCT:
      return { ...state, brandsProduct: action.payload };
    case GET_CATEGORY_PRODUCT:
      return { ...state, categoryProduct: action.payload };
    default:
      return state;
  }
};

export default productReducer;
