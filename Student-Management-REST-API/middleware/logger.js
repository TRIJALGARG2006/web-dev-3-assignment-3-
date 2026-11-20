function requestLogger(req, res, next) {
  const started = Date.now();

  res.on('finish', () => {
    const timeTaken = Date.now() - started;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} (${timeTaken} ms)`);
  });

  next();
}

module.exports = requestLogger;
