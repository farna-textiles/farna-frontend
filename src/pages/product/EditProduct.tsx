import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, Grid } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getProduct, updateProduct } from '../../api/productApi';
import { Loader } from '@mantine/core';
import { Product, User } from '../../interfaces';

interface EditProductProps {
  open: boolean;
  onClose: () => void;
  data: number;
}

const validationSchema = Yup.object().shape({
  lotNo: Yup.number().required('Lot No is required').min(1, 'Must be a positive value'),
  danier: Yup.string().required('Danier is required'),
  type: Yup.string().required('Type is required'),
  noOfFilaments: Yup.number().required('No Of Filaments is required').min(1, 'Must be a positive value'),
  luster: Yup.string().required('Luster is required'),
});

const EditProduct: React.FC<EditProductProps> = ({ open, onClose, data }) => {
  const [product, setProduct] = useState<Product>({
    id: '',
    lotNo: -1,
    danier: '',
    type: '',
    noOfFilaments: -1,
    luster: '',
    userId: ''
  });

  useEffect(() => {
    getProduct(data)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = (values: Product) => {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo: User = userInfoString ? JSON.parse(userInfoString) : null; 
    updateProduct(product.id, {
      lotNo: values.lotNo,
      danier: values.danier,
      type: values.type,
      noOfFilaments: values.noOfFilaments,
      luster: values.luster,
      userId: userInfo.id,
    });
  };

  return (
    <Modal open={open} onClose={handleClose} className='flex justify-center items-center'>
      {(true) ? (
        <div className='md:w-1/2 w-[90%] bg-white py-4 px-8  rounded-md'>
          <Formik initialValues={product} onSubmit={handleSave} validationSchema={validationSchema}>
            {() => (
              <Form>
                <h1 className='font-semibold text-2xl pb-4'>Edit Product</h1>
                <Grid container spacing={2}>
                  <div className='flex flex-col flex-1 py-4 pl-4 space-y-4'>
                    <div>
                      <Field
                        as={TextField}
                        id="lotNo"
                        name="lotNo"
                        fullWidth
                        type="number"
                        label="Lot No"
                        variant="outlined"
                      />
                      <ErrorMessage name="lotNo" component="div" style={{ color: 'red', fontSize: '12px' }} />
                    </div>

                    <div>
                      <Field
                        as={TextField}
                        id="danier"
                        fullWidth
                        name="danier"
                        type="text"
                        label="Danier"
                        variant="outlined"
                      />
                      <ErrorMessage name="danier" component="div" style={{ color: 'red', fontSize: '12px' }} />
                    </div>

                    <div>
                      <Field
                        as={TextField}
                        id="type"
                        name="type"
                        type="text"
                        fullWidth
                        label="Type"
                        variant="outlined"
                      />
                      <ErrorMessage name="type" component="div" style={{ color: 'red', fontSize: '12px' }} />
                    </div>

                    <div>
                      <Field
                        as={TextField}
                        fullWidth
                        id="noOfFilaments"
                        name="noOfFilaments"
                        type="number"
                        label="No Of Filaments"
                        variant="outlined"
                      />
                      <ErrorMessage name="noOfFilaments" component="div" style={{ color: 'red', fontSize: '12px' }} />
                    </div>

                    <div>
                      <Field
                        as={TextField}
                        id="luster"
                        name="luster"
                        fullWidth
                        type="text"
                        label="Luster"
                        variant="outlined"
                      />
                      <ErrorMessage name="luster" component="div" style={{ color: 'red', fontSize: '12px' }} />
                    </div>
                  </div>
                </Grid>
                
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Button variant="outlined" onClick={handleClose} style={{ marginRight: '10px' }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default EditProduct;
