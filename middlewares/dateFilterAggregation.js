module.exports = (req, res, next) => {
  const { startDate, endDate } = req.query;
  let dateMatch;
  if (startDate && endDate) {
    dateMatch = {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    };
  }

  if (startDate && !endDate) {
    dateMatch = {
      $match: {
        createdAt: { $gte: new Date(startDate) }
      }
    };
  }

  if (!startDate && endDate) {
    dateMatch = {
      $match: {
        createdAt: { $lte: new Date(endDate) }
      }
    };
  }

  if (dateMatch) req.dateFilter = dateMatch;
  next();
};
