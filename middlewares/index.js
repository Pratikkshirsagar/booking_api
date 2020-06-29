exports.provideErrorHandlers = (req, res, next) => {
  res.mongoError = (dbError) => {
    const normalizedErrors = [];
    const errorField = 'errors';

    if (
      dbError &&
      dbError.hasOwnProperty(errorField) &&
      dbError.name === 'validationError'
    ) {
      const errors = dbError[errorField];

      for (let property in errors) {
        normalizedErrors.push({
          title: property,
          detail: errors[property].message,
        });
      }
    } else {
      normalizedErrors.push({
        title: 'DB Error',
        detail: 'Ooops something went wrong',
      });
    }

    return res.status(422).send({ errors: normalizedErrors });
  };

  next();
};
