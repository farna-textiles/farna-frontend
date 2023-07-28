/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChangeEvent, UserFormInput } from '../interfaces';
import AuthBanner from '../components/auth/AuthBanner';
import Form from '../components/elements/Form';
import { useSignUp } from '../hooks/useAuth';

const SignUp: React.FC = () => {
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const { invitationToken } = useParams<{ invitationToken: string }>();

  const signupMutation = useSignUp();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({
      ...userData,
      invitationToken:
        invitationToken &&
        decodeURIComponent(invitationToken.replace(/%2E/g, '.')),
    });
  };

  const inputList: UserFormInput[] = [
    {
      label: 'Email Address',
      type: 'email',
      name: 'email',
      value: userData.email,
      placeholder: 'name@company.com',
    },
    {
      label: 'Email Address',
      type: 'text',
      name: 'username',
      value: userData.username,
      placeholder: 'Enter username',
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

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  return (
    <div className="flex">
      <div
        className={`flex-1 flex items-center justify-center h-screen transition-transform duration-1000 transform ${
          animate ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-full max-w-md space-y-8 px-4 bg-transparent text-gray-600 sm:px-0">
          <div className="">
            <img
              src="/farna-logo.png"
              width={150}
              className="lg:hidden"
              alt="farna logo"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Sign up
              </h3>
              <p className="">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center">
              <div className="flex-grow bg-gray-300 h-px" />
              <p className="text-sm bg-transparent px-2 mx-2">
                Or continue with
              </p>
              <div className="flex-grow bg-gray-300 h-px" />
            </div>
          </div>
          <Form
            inputList={inputList}
            handleFormSubmit={handleFormSubmit}
            buttonLabel="Create account"
            onChangeHandler={onChangeHandler}
            isLoading={signupMutation.isLoading}
          />
        </div>
      </div>
      <AuthBanner animate={animate} />
    </div>
  );
};

export default SignUp;
