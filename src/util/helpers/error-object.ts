export const getError = (status = 500, msg = '') => {
  let message = '';

  if (status === 400) {
    message = 'Bad Request';
  }
  if (status === 404) {
    message = 'Not Found';
  }
  if (status === 401) {
    message = 'Not Authenticated';
  }
  if (status === 403) {
    message = 'Forbidden.';
  }
  if (status === 500) {
    message = 'Internal Server Error';
  }
  if (msg) {
    message = msg;
  }

  return { status, message };
};