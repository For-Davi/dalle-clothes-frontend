/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { Notify } from 'quasar';

export const createError = (error: any) => {
  let message = 'Error';
  if (error instanceof AxiosError) {
    message = error.response?.data?.message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  console.log('message', message);
  Notify.create({
    message,
    type: 'negative',
  });
};

export const createSuccess = (message: string) => {
  Notify.create({
    message,
    type: 'positive',
  });
};

export const createErrorData = (message: string) => {
  Notify.create({
    message,
    type: 'negative',
  });
};
