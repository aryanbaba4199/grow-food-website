import { getterFunction, updaterFunction, vendorApi } from "@/Api";
import UserContext from "@/userContext";
import {
  Dialog,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import EditProducts from "../Admin/products/EditProducts";
import ViewProduct from "../Admin/products/ViewProduct";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [productView, setProductView] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    getVendorProducts();
  }, [currentPage]);

  const getVendorProducts = async () => {
    try {
      const res = await getterFunction(
        `${vendorApi.products}/${user._id}/page=${currentPage}`
      );
      setProducts(res.products);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisplayToggle = async (id, display) => {
    const formData = {
      id,
      display: !display, // Toggle the display value
    };
    try {
      await updaterFunction(`${vendorApi.displayProducts}`, formData);
      await getVendorProducts(); // Refresh the product list
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="mb-4">
          Product Management
        </Typography>
        
        <Link
          href={"/admin/product"}
          className="bg-[#15892e] text-white px-4 p-1 rounded-md flex gap-2 items-center"
        >
          <CiCirclePlus className="font-bold text-lg" /> Create Product
        </Link>
      </div>
      {products?.length !== 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Life</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Stock</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Product Qty</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Min Order Qty</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Display</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.categories}</TableCell>
                    <TableCell>{row.life}</TableCell>
                    <TableCell>{row.sellingPrice}</TableCell>
                    <TableCell>{row.availableQty}</TableCell>
                    <TableCell>{row.productQty}</TableCell>
                    <TableCell>{row.minimumOrderQty}</TableCell>
                    <TableCell>
                      {row.status ||
                        (row.availableQty > 0 ? "Available" : "Not Available")}
                    </TableCell>
                    <TableCell>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={row.display}
                          onChange={() =>
                            handleDisplayToggle(row._id, row.display)
                          }
                        />
                        <div
                          className={`peer relative rounded-full outline-none duration-100 after:duration-500 w-28 h-12 ${
                            row.display ? "bg-green-500" : "bg-red-500"
                          } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}
                        >
                          <div
                            className={`absolute top-1 left-1 h-10 w-10 flex justify-center items-center rounded-full bg-white text-black font-bold transition-transform duration-500 ${
                              row.display ? "translate-x-14" : ""
                            }`}
                          >
                            {row.display ? "Yes" : "No"}
                          </div>
                        </div>
                      </label>
                    </TableCell>
                    <TableCell>
                      <FaEye
                        className="text-lg text-[#15892e] cursor-pointer"
                        onClick={() => setProductView(row)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            className="mt-4 flex justify-center"
          />
        </>
      )}
      <Dialog open={productView !== null} onClose={() => setProductView(null)}>
        {productView && (
          <ViewProduct
            product={productView}
            setProduct={setProductView}
            setEditMode={setEditProduct}
          />
        )}
      </Dialog>
      <Dialog open={editProduct !== null} onClose={() => setEditProduct(null)}>
        {editProduct && (
          <EditProducts product={editProduct} setEditMode={setEditProduct} />
        )}
      </Dialog>
    </div>
  );
};

export default Products;
