export function isResultPosted(resultsPosted, userId) {
  const isResultPosted = !!Object.keys(resultsPosted).find(key =>
    resultsPosted[key].find(result => result.postedBy === userId)
  );
  return isResultPosted;
}

export function isParticipant(match, userId) {
  return (
    match.createdBy._id === userId ||
    (match.joinee && match.joinee._id === userId)
  );
}

export function getOpponent(match, userId) {
  if (match.createdBy._id === userId) {
    return match.createdBy;
  }
  if (match.joinee && match.joinee._id === userId) return match.joinee;
  return {};
}
