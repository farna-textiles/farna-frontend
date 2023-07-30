import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Modal, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MultiSelect from './component/MultiSelect';
import AddIcon from '@mui/icons-material/Add';
import CreateUserEnd from './CreateEndUse';
import { Box, Loader } from '@mantine/core';
import { getAllEndUses } from '../../api/endUserApi';
import ScreenLoader from '../../components/screen-loader/ScreenLoader';
import { User } from '../../interfaces';
import { createProduct } from '../../api/productApi';

const validationSchema = Yup.object().shape({
  lotNo: Yup.number().required('Lot No is required').min(1, 'Must be a positive value'),
  danier: Yup.string().required('Danier is required'),
  type: Yup.string().required('Type is required'),
  noOfFilaments: Yup.number().required('No Of Filaments is required').min(1, 'Must be a positive value'),
  luster: Yup.string().required('Luster is required'),
});


const CreateProduct = () => {
  const initialValue = {
    lotNo: '',
    danier: '',
    type: '',
    noOfFilaments: '',
    luster: '',
    userId: ''
  };

  const [selectedOptions, setSlectedOptions] = useState<String[]>([]);
  const [open, setOpen] = useState(false);

  const [isLoader, setIsLoader] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [optionNew, setOptionNew] = useState<Object[]>([]);

  
  const handleCreate = (values: object) => {
    setLoaderMessage("Product Creation in progress")
    setIsLoader(true);
    let tmp = {
        ...values,
        'endUser':{
            db:selectedOptions,
            new: optionNew
        },
        'userId': ''
    }
    console.log(tmp, "Form Submit")
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo: User = userInfoString ? JSON.parse(userInfoString) : null;
    tmp['userId'] = userInfo.id;
    createProduct(tmp)
    .then(() => {
      setIsLoader(false);
    })
    .catch((error) => {
      console.error(error);
    })
  };
  
  useEffect(() => {
    setLoaderMessage("Fething End Uses")
    getAllEndUses().then((response) => {
      let allEndUsesOptions = response?.data?.map((item: { name: string; id: string; }) => ({label: item.name, value: item.id}))
      setOptions(allEndUsesOptions);
      setIsLoader(false);
      setLoaderMessage("")
    })
    .catch(() => {})
  }, [isLoader]);

  const SaveSelectOption = (values: string[]) => {
    setSlectedOptions([...values])
  }

  const handleCreateUser = (name: string, description?: string) => {
    const useEnd = { name, description }
    if (optionNew.some((option) => option.name === name)) {
      // add error message
      return; 
    }
    setOptionNew([...optionNew, useEnd])
    handleClose()
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoader) return <ScreenLoader message={loaderMessage}/>
  return (
        <div className='w-full mx-auto bg-white py-4 px-8  rounded-md'>
          {open && 
          <Modal open={open} onClose={handleClose} className='flex justify-center items-center'>
                <div className='md:w-1/2 w-[90%] bg-white py-4 px-8 rounded-md outline-none'>
                    <CreateUserEnd trigger={handleCreateUser} />
                </div>
            </Modal>
          }
          <Formik initialValues={initialValue} onSubmit={handleCreate} validationSchema={validationSchema}>
            {() => (
              <Form>
                <h1 className='font-semibold text-2xl pb-4'>Create Product</h1>
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
                    <div className='flex spaxe-x-2 justify-between items-center' >
                        <div className='w-[90%]'><MultiSelect options={options} newOptions={optionNew} title="Select End User" trigger={SaveSelectOption}/></div>
                        <div onClick={handleOpen} className='w-[8%] flex justify-center items-center border border-gray-300 cursor-pointer hover:border-none hover:bg-gray-300 rounded-md h-full px-2'><AddIcon /></div>
                    </div>
                  </div>
                </Grid>
                
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Button type="submit" variant="contained" color="primary">
                    Create
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
  )
  
};

export default CreateProduct;
