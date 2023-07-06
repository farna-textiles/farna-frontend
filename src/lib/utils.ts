// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';

export const notifySuccess = (text: string) =>
  toast.success(text, { theme: 'light' });
export const notifyError = (text: string) =>
  toast.error(text, { theme: 'light' });
