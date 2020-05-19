export function isResultPosted(resultsPosted, userId) {
  const isResultPosted = !!Object.keys(resultsPosted).find(key =>
    resultsPosted[key].find(result => result.postedBy === userId)
  );
  return isResultPosted;
}
