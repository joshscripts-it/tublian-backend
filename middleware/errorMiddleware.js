const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // If headers have already been sent, delegate to Express default error handler. This prevent [Can't send request after header have been send error]
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    msg: err?.msg || err?.message || "Something went wrong",
    statusCode,
    stack:
      process.env.NODE_ENV !== "production" && "[ERROR STACK]: " + err.stack,
  });

  // next();
};

module.exports = {
  errorHandler,
};
