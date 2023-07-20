/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Form from '../components/elements/Form';
import { ChangeEvent, UserFormInput } from '../interfaces';
import AuthBanner from '../components/auth/AuthBanner';
import { useSignIn } from '../hooks/useAuth';

const SignIn: React.FC = () => {
  const [userData, setUserData] = useState({ identifier: '', password: '' });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const signinMutation = useSignIn();

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

  const onChangeHandler = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex">
      <div
        className={`flex-1 flex items-center justify-center h-screen transition-transform duration-1000 transform ${
          animate ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
            isLoading={signinMutation.isLoading}
          />
        </div>
      </div>
      <AuthBanner animate={animate} />
    </div>
  );
};

export default SignIn;
