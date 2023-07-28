/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Form from '../components/elements/Form';
import {
  ChangeEvent,
  FieldConfig,
  FogetPassword,
  UserFormInput,
} from '../interfaces';
import AuthBanner from '../components/auth/AuthBanner';
import { useReactivation, useSignIn } from '../hooks/useAuth';
import CustomModal from '../components/Modal';

const SignIn: React.FC = () => {
  const [userData, setUserData] = useState({ identifier: '', password: '' });
  const [animate, setAnimate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<FogetPassword>({
    email: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const signinMutation = useSignIn();
  const reactivateMutation = useReactivation();
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signinMutation.mutate(userData);
  };

  const inputList: UserFormInput[] = [
    {
      label: 'Identifier',
      type: 'text',
      name: 'identifier',
      value: userData.identifier,
      placeholder: 'Enter email or username',
    },
    {
      label: 'Password',
      type: 'password',
      name: 'password',
      value: userData.password,
      placeholder: 'Enter password',
    },
  ];

  const userFields: FieldConfig<FogetPassword>[] = useMemo(
    () => [{ label: 'Email', name: 'email', type: 'email' }],
    []
  );

  const userValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required.'),
  });

  const requestLink = useMemo(() => {
    const isError = signinMutation?.error?.message === 'Account is disabled';

    return (
      <div className="flex justify-end">
        {isError ? (
          <p className="text-red-500 w-fit">
            Click{' '}
            <span
              className="underline cursor-pointer text-black"
              onClick={() => reactivateMutation.mutate(userData)}
            >
              here
            </span>{' '}
            to submit a reactivation request.
          </p>
        ) : (
          <p
            className="text-black w-fit cursor-pointer hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            Forgot your password?
          </p>
        )}
      </div>
    );
  }, [reactivateMutation, signinMutation?.error?.message, userData]);

  const onChangeHandler = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = (data: FogetPassword) => {
    // api not available
    handleModalClose();
  };

  return (
    <div className="flex">
      <div
        className={`flex-1 flex items-center justify-center h-screen transition-transform duration-1000 transform ${
          animate ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CustomModal<FogetPassword & Record<string, any>>
          data={modalData as FogetPassword}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          fields={userFields}
          validationSchema={userValidationSchema}
          title="Forget Password"
        />
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div className="">
            <img
              src="/farna-logo.png"
              width={150}
              className="lg:hidden"
              alt="farna logo"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Login
              </h3>
              <p className="">
                Already have an account ?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  SignUp
                </Link>
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="block w-full h-px bg-gray-300" />
            <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">
              Or continue with
            </p>
          </div>
          <Form
            inputList={inputList}
            handleFormSubmit={handleFormSubmit}
            buttonLabel="Login"
            onChangeHandler={onChangeHandler}
            isLoading={signinMutation.isLoading || reactivateMutation.isLoading}
            error={requestLink}
          />
        </div>
      </div>
      <AuthBanner animate={animate} />
    </div>
  );
};

export default SignIn;
