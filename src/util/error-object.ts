export const getError = (status = 500, message = '') => {
  const error = new Error();
  if (message) {
    error.message = message;
    return error;
  }
  if (status === 400) {
    error.message = 'Bad Request';
  }
  if (status === 404) {
    error.message = 'Not Found';
  }
  if (status === 401) {
    error.message = 'Not Authenticated';
  }
  if (status === 403) {
    error.message = 'Forbidden.';
  }
  if (status === 403) {
    error.message = 'Internal Server Error';
  }

  return { status, error };
};