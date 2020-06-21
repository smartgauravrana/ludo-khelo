const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in|ne|eq|nin)\b/g,
    match => `$${match}`
  );

  if (req.query.history) {
    queryStr = { $or: [{ createdBy: req.user.id }, { joinee: req.user.id }] };
    queryStr = JSON.stringify(queryStr);
  }

  // for status fields on resource
  if (req.query.status && req.query.status.nin) {
    const fields = req.query.status.nin.split(",").map(field => field.trim());
    queryStr = {
      status: { $nin: fields }
    };
    queryStr = JSON.stringify(queryStr);
  }

  // Finding resource
  console.log(JSON.parse(queryStr));
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort({ _id: -1 });
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate.length) {
    populate.forEach(field => {
      query = query.populate(field);
    });
  }

  // Executing query
  const results = await query;

  // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit
  //   };
  // }

  res.advancedResults = {
    success: true,
    total,
    // pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
