import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, CircularProgress,Divider,TableContainer
} from '@mui/material';
import axios from 'axios';


const CompanyProductTable = () => {
  const companyName = localStorage.getItem('companyName'); // ✅ Get from localStorage
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${companyName}`);
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchProducts();
    }
  }, [companyName]);

  

  return (


<Container >
  <Paper elevation={3}>
    <TableContainer sx={{ maxHeight: { xs: 300, md: "none" }, maxWidth:{xs:260,md:"none"},overflowX: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", md: "0.875rem" },
                backgroundColor: "#24c6efff"
              }}
            >
              Loan Type
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", md: "0.875rem" },
                backgroundColor: "#24c6efff"
              }}
            >
              Interest Rate (%)
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", md: "0.875rem" },
                backgroundColor: "#24c6efff"
              }}
            >
              Min Amount (₹)
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", md: "0.875rem" },
                backgroundColor: "#24c6efff"
              }}
            >
              Max Amount (₹)
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "0.7rem", md: "0.875rem" },
                backgroundColor: "#24c6efff"
              }}
            >
              Tenure (months)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  {product.type}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  {product.interestRate}%
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  ₹{product.minAmount}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  ₹{product.maxAmount}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}>
                  {product.tenure}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ fontSize: { xs: "0.7rem", md: "0.8125rem" } }}
              >
                No products available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Container>

  );
};

export default CompanyProductTable;

