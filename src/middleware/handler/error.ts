export const handleError = (error, req, res, next) => {
  console.log('cc ', error);
  const { status = 500, message, data } = error;
  console.log('message ', message);
  console.log('status ', status);
  res.status(status).json({ message, data: data });
};