const logger = (req, res, next) => {
  const requestStartedAt = Date.now();

  res.on('finish', () => {
    const elapsedMilliseconds = Date.now() - requestStartedAt;
    const requestLine = [
      new Date().toISOString(),
      req.method,
      req.originalUrl,
      res.statusCode,
      `${elapsedMilliseconds}ms`
    ].join(' ');

    console.log(requestLine);
  });

  next();
};

module.exports = logger;
