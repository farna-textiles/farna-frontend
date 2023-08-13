import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Modal, Box, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useInfiniteQuery } from '@tanstack/react-query';
import Multiselect from 'multiselect-react-dropdown';
import { debounce } from 'lodash';
import { useNavigate, useParams } from 'react-router';
import CreateUserEnd from './CreateEndUse';
import {
  EndUse,
  EndUseOption,
  Product,
  ProductData,
  ProductUpdateData,
} from '../../interfaces';
import { notifyError } from '../../lib/utils';
import { getAllEndUses } from '../../api/endUserApi';
import useCreateEndUse from '../../hooks/useEndUse';
import { userInfo } from '../../services/authService';
import { useProduct, useUpdateProduct } from '../../hooks/useProduct';

const validationSchema = Yup.object().shape({
  lotNo: Yup.string()
    .required('Lot No is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Invalid lot number'),
  denier: Yup.string().required('Denier is required'),
  type: Yup.string()
    .required('Type is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Invalid type'),
  noOfFilaments: Yup.string()
    .required('No Of Filaments is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Invalid No of Filaments'),
  luster: Yup.string().required('Luster is required'),
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: productData } = useProduct(
    parseInt(id as string, 10) as number
  ) as { data: ProductData };

  const [selectedOptions, setSlectedOptions] = useState<EndUseOption[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const endUseMutation = useCreateEndUse();
  const updateProductMutation = useUpdateProduct();

  const navigate = useNavigate();

  const {
    data: endUses,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['endUses', searchTerm],
    async ({ pageParam = 1 }) => {
      const response = await getAllEndUses(pageParam, searchTerm);
      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return allPages.length + 1;
      },
    }
  );

  const flatEndUses = endUses?.pages.flat();

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const dropdown = e.target as HTMLElement;
      if (
        dropdown.scrollHeight - dropdown.scrollTop === dropdown.clientHeight &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    const dropdown = document.querySelector('.optionContainer');

    if (dropdown) {
      dropdown.addEventListener('scroll', handleScroll);
      return () => dropdown.removeEventListener('scroll', handleScroll);
    }

    return () => {};
  }, [fetchNextPage, hasNextPage]);

  const handleUpdate = async (values: Product) => {
    const data = {
      ...values,
      endUses: [...selectedOptions.map((option) => option.value)],
      userId: userInfo().id,
    };

    if (id) {
      await updateProductMutation.mutateAsync([+id, data as ProductUpdateData]);
      navigate(`/products`);
    }
  };

  const formFields = [
    {
      name: 'lotNo',
      label: 'Lot No',
      type: 'text',
    },
    {
      name: 'denier',
      label: 'Denier',
      type: 'text',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'text',
    },
    {
      name: 'noOfFilaments',
      label: 'No Of Filaments',
      type: 'text',
    },
    {
      name: 'luster',
      label: 'Luster',
      type: 'text',
    },
  ];

  const SaveSelectOption = (values: EndUseOption[]) => {
    setSlectedOptions([...values]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateEndUse = async (name: string, description?: string) => {
    const useEnd = { name, description };
    if (flatEndUses?.some((option) => option.name === name)) {
      notifyError('End Use already exists');
      return;
    }
    await endUseMutation.mutateAsync(useEnd);
    handleClose();
  };

  const setSearchTermDebounced = debounce((value: string) => {
    setSearchTerm(value);
    refetch();
  }, 300);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Edit Product
      </Typography>
      <hr className="my-12" />

      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <div className="md:w-1/2 w-[90%] bg-white py-4 px-8 rounded-md outline-none">
          <CreateUserEnd trigger={handleCreateEndUse} />
        </div>
      </Modal>

      <Formik
        initialValues={productData}
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <Grid container spacing={2}>
              <div className="flex flex-col flex-1 py-4 pl-4 space-y-4">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <Field
                      as={TextField}
                      id={field.name}
                      name={field.name}
                      fullWidth
                      type={field.type}
                      label={field.label}
                      variant="outlined"
                    />
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      style={{ color: 'red', fontSize: '12px' }}
                    />
                  </div>
                ))}
                <div className="flex spaxe-x-2 justify-between items-center">
                  <div className="w-[90%]">
                    <Multiselect
                      options={flatEndUses?.map((item: EndUse) => ({
                        name: item.name,
                        value: item.id,
                      }))}
                      displayValue="name"
                      showCheckbox
                      placeholder="Select EndUse"
                      onSearch={(value: string) =>
                        setSearchTermDebounced(value)
                      }
                      selectedValues={productData?.endUses?.map(
                        (endUse: EndUse) => {
                          return {
                            name: endUse.name,
                            value: endUse.id,
                          };
                        }
                      )}
                      onSelect={SaveSelectOption}
                      onRemove={(removedItem: EndUseOption[]) => {
                        setSlectedOptions(removedItem);
                      }}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="w-[8%] flex justify-center items-center border border-gray-300 cursor-pointer hover:border-none hover:bg-gray-300 rounded-md h-full px-2"
                  >
                    <AddIcon />
                  </button>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProduct;
