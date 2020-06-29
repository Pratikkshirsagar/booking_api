exports.provideErrorHandlers = (req, res, next) => {
  res.sendAPiError = function (config) {
    const { status = 422, title, detail } = config;
    return res.status(status).send({ error: [{ title, detail }] });
  };

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
