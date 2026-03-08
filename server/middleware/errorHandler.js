export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Unique constraint violation',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found',
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

