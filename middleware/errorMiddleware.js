const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode).json({
    msg: "Something went wrong",
    statusCode: 500,
    stack: process.env.NODE_ENV !== "production" && err.stack,
  });
};

module.exports = {
  errorHandler,
};
