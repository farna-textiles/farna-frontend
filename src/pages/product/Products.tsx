import { useMemo, useState } from "react";
import { ActionButton, TableColumn, ProductObject as Product } from "../../interfaces";
import Edit from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';
import GenericTable from "../../components/table/GenericTable";
import { deleteProduct, getAllProducts, getAllProductsTemp } from "../../api/productApi";
import EditProduct from "./EditProduct.jsx";
import ScreenLoader from "../../components/screen-loader/ScreenLoader.js";

const Products = () => {

    const [modalStatus, setModalStatus] = useState(-1)
    const [deleteRow, setDeleteRow] = useState(false)
    const columns: TableColumn<Product>[] = useMemo(
      () => [
        { field: 'id', label: 'ID' },
        { field: 'lotNo', label: 'Lot No' },
        { field: 'danier', label: 'Danier' },
        { field: 'type', label: 'Type' },
        { field: 'noOfFilaments', label: 'No Of Filaments' },
        { field: 'luster', label: 'Luster' },
      ],
      []
    );
    const handleCloseModal = () => {
        setModalStatus(-1);
      };

    const actionButtons: ActionButton[] = useMemo(
      () => [
        {
          icon: <Edit />,
          onClick: (id: number) => {
            setModalStatus(id)
          },
        },
        {
          icon: <DeleteIcon />,
          onClick: (id: number) => {
            setDeleteRow(true);
            deleteProduct(id)
            .then(() => {
              console.log("Deleteion of product : Sucess")
              // TODO: Add Toast Messaeg
            })
            .catch((error) => console.log("Deleteion of product : Failed"))
            .finally(() => { setDeleteRow(false) })
          },
        },
      ], []
    );
  
    return (
      <Box sx={{ m: 4 }}>
        <Typography variant="h4" component="div" gutterBottom>
          Products
        </Typography>
        {deleteRow ? <ScreenLoader message={"Deletion of product in progress"}/> :
        <>
          {modalStatus !== -1 && <EditProduct open={modalStatus !== -1 ? true : false} onClose={handleCloseModal} data={modalStatus}/>}
          <hr className="mb-12" />
          <Box sx={{ my: 2 }}>
            <GenericTable<Product>
              tableName="Products"
              columns={columns}
              fetchData={getAllProductsTemp}
              actionButtons={actionButtons}
              addButtonLink="/product/new"
              addButtonLabel="Create Product"
            />
          </Box>
          </>
        }
      </Box>
    );
  };
  
  export default Products;