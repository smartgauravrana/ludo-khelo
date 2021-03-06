const advancedResults = (model, populate = [], fieldsToExclude='') => async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit", "search"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in|ne|eq|nin|regex)\b/g,
    match => `$${match}`
  );

  if (req.query.history) {
    queryStr = { $or: [{ createdBy: req.user.id }, { joinee: req.user.id }] };
    queryStr = JSON.stringify(queryStr);
  }

  // for status fields on resource
  if (req.query.status && req.query.status.nin) {
    const fields = req.query.status.nin.split(",").map(field => field.trim());
    const oldQueryStr = JSON.parse(queryStr);
    delete oldQueryStr.status;
    queryStr = {
      status: { $nin: fields },
      ...oldQueryStr
    };
    queryStr = JSON.stringify(queryStr);
  }

  console.log("req: ", req.query)
  if(req.query.search){
    const searchInfo = JSON.parse(req.query.search);
    console.log("searchInfo: ", searchInfo)
    const expression = `.*${searchInfo.value}.*`;
    const rx = new RegExp(expression, "i");
    queryStr = {
      [searchInfo.field]: {$regex: new RegExp(expression, "i")}
    };
    // queryStr = JSON.stringify(queryStr);
  }

  // Finding resource
  queryStr = req.query.search ? queryStr : JSON.parse(queryStr)
  console.log(queryStr);
  query = model.find(queryStr);

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
  const total = await model.countDocuments(queryStr);

  query = query.skip(startIndex).limit(limit);

  if (populate.length) {
    populate.forEach(field => {
      query = query.populate(field, fieldsToExclude);
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
