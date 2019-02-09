const PREPARE_MORE_DATA = 'PREPARE_MORE_DATA';
const FETCH_MORE_DATA = 'FETCH_MORE_DATA';

const fetchForDataGrid = ({
  startIndex,
  stopIndex,
  getRows,
  groupBy,
  expanded
}) => (dispatch, getState) => {
  // rows = UI display
  const [, dataIndex, loaded] = getRows(getState(), { groupBy, expanded });
  if (!!loaded[startIndex] && !!loaded[stopIndex]) {
    // skip, caused by resetting cache + reloading of visible range
    console.log('skipped');
    return Promise.resolve();
  }

  const dataStart = dataIndex[startIndex];
  const dataEnd = dataIndex[stopIndex];

  dispatch({ type: PREPARE_MORE_DATA, payload: { dataStart, dataEnd } });
  // console.log('after dispatch');

  setTimeout(() => {
    promiseResolver();
    dispatch({ type: FETCH_MORE_DATA, payload: { dataStart, dataEnd } });
  }, 1000 + Math.round(Math.random() * 2000));

  let promiseResolver;

  return new Promise(resolve => {
    promiseResolver = resolve;
  });
};

export default fetchForDataGrid;
export { PREPARE_MORE_DATA, FETCH_MORE_DATA };
