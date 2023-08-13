import { useEffect, useRef, useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Modal,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useInfiniteQuery } from '@tanstack/react-query';
import Multiselect from 'multiselect-react-dropdown';
import { debounce } from 'lodash';
import { Loader } from '@mantine/core';
import CreateUserEnd from './CreateEndUse';
import { EndUse, EndUseOption, Product } from '../../interfaces';
import { notifyError } from '../../lib/utils';
import { getAllEndUses } from '../../api/endUserApi';
import useCreateEndUse from '../../hooks/useEndUse';
import { userInfo } from '../../services/authService';
import { useCreateProduct } from '../../hooks/useProduct';

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

const CustomButton = styled(Button)(({ theme, disabled }) => ({
  position: 'relative',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  ...(disabled && {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
    pointerEvents: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
      borderColor: theme.palette.grey[300],
      color: theme.palette.text.primary,
    },
  }),
  ...(disabled && {
    pointerEvents: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
    },
  }),
}));

const CreateProduct = () => {
  const initialValue: Product = {
    lotNo: '',
    denier: '',
    type: '',
    noOfFilaments: '',
    luster: '',
    userId: '',
  };

  const [selectedOptions, setSlectedOptions] = useState<EndUseOption[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [multiselectOptions, setMultiselectOptions] = useState<EndUseOption[]>(
    []
  );

  const dropdownRef = useRef<Multiselect | null>(null);

  const endUseMutation = useCreateEndUse();
  const createProductMutation = useCreateProduct();

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
      suspense: false,
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

    if (dropdownRef.current) {
      const dropdown = document.querySelector('.optionContainer');

      if (dropdown) {
        dropdown.addEventListener('scroll', handleScroll);
        return () => dropdown.removeEventListener('scroll', handleScroll);
      }
    }

    return () => {};
  }, [dropdownRef, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (flatEndUses) {
      const newOptions = flatEndUses.map((item: EndUse) => ({
        name: item.name,
        value: item.id?.toString() || '',
      }));

      setMultiselectOptions(newOptions);
    }
  }, [flatEndUses]);

  const handleCreate = async (values: Product) => {
    const data = {
      ...values,
      endUses: [...selectedOptions.map((option) => option.value)],
      userId: userInfo().id,
    };

    await createProductMutation.mutateAsync(data as Product);
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

  const setSearchTermDebounced = debounce((value: string) => {
    setSearchTerm(() => value);
    refetch();
  }, 300);

  const SaveSelectOption = (values: EndUseOption[]) => {
    setSearchTermDebounced('');
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

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Create Product
      </Typography>
      <hr className="my-12" />

      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <div className="md:w-1/2 w-[90%] bg-white py-4 px-8 rounded-md outline-none">
          <CreateUserEnd
            trigger={handleCreateEndUse}
            isLoading={endUseMutation.isLoading}
          />
        </div>
      </Modal>

      <Formik
        initialValues={initialValue}
        onSubmit={handleCreate}
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
                      options={multiselectOptions}
                      ref={dropdownRef}
                      displayValue="name"
                      showCheckbox
                      placeholder="Select EndUse"
                      onSearch={(value: string) =>
                        setSearchTermDebounced(value)
                      }
                      onSelect={SaveSelectOption}
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
              <CustomButton
                type="submit"
                disabled={createProductMutation.isLoading}
              >
                {createProductMutation.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader color="white" />
                  </div>
                )}
                Create
              </CustomButton>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProduct;
