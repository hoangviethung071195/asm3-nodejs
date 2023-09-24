export const handleError = (error, req, res, next) => {
  console.log(error);
  const { status = 500, message, data } = error;

  res.status(status).json({ message, data: data });
};