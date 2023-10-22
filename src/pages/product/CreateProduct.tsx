/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useRef, useState } from 'react';
import { Grid, Modal, Box, IconButton, Tooltip } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useInfiniteQuery } from '@tanstack/react-query';
import Multiselect from 'multiselect-react-dropdown';
import { debounce } from 'lodash';
import CreateUserEnd from './CreateEndUse';
import { EndUse, EndUseOption, Product } from '../../interfaces';
import { notifyError } from '../../lib/utils';
import { getAllEndUses } from '../../api/endUserApi';
import useCreateEndUse from '../../hooks/useEndUse';
import { userInfo } from '../../services/authService';
import { useCreateProduct } from '../../hooks/useProduct';
import Heading from '../../components/elements/Heading';
import ButtonLoader from '../../components/elements/buttons/ButtonLoader';
import FormFields from '../../components/form/FormFields';

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
        value: item.id || -1,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ mx: 4, my: 4 }}>
      <Heading
        title="Add Product"
        description="Enter the information for a new product"
      />
      <hr className="mb-6" />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        className="flex justify-center items-center transition-transform transform ease-out duration-300"
      >
        <div
          className="relative bg-white rounded-lg shadow-lg overflow-hidden
           md:w-1/2 w-full max-w-3xl transition-transform transform ease-out duration-300"
        >
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h3
                id="modal-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Create New End Use
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <CreateUserEnd
                trigger={handleCreateEndUse}
                isLoading={endUseMutation.isLoading}
              />
              {endUseMutation.isLoading && (
                <div className="flex justify-center items-center mt-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-200" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <Formik
        initialValues={initialValue}
        onSubmit={handleCreate}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form onKeyDown={handleKeyDown}>
            <Grid container spacing={2} direction="column">
              {formFields.map((field) => (
                <Grid item xs={12} key={field.name}>
                  <FormFields key={field.name} {...field} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
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
                  <div className="flex-shrink-0 ml-4">
                    <Tooltip title="Add new end use">
                      <IconButton
                        type="button"
                        onClick={handleOpen}
                        className=""
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} className="submitBtnContainer">
                <ButtonLoader
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Save & Exit
                </ButtonLoader>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProduct;
