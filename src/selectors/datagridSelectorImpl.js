import { createSelector } from 'reselect';
import { groupBy } from 'lodash';

const nonGroup = (totalSize, ids, loadedMap) => {
  const rows = [];
  const loaded = [];

  for (let i = 0; i < totalSize; i++) {
    rows[i] = ids[i];
    loaded[i] = loadedMap[i];
  }

  return [rows, loaded];
};

const getSize = list => {
  return list.reduce((acc, { size }) => {
    return (acc += size);
  }, 0);
};

const impl = (ids, loadedMap, list, groupByProp, expanded) => {
  const dataMap = {};
  const loaded = [];

  // do count here
  let headerCount = 0;
  let idPointer = 0;
  let expandedSize = 0;

  const flattenGroup = (list, groupByProp, expanded, path) => {
    if (!groupByProp.length) {
      return list;
    }

    const groupName = groupByProp[0];
    const group = groupBy(list, groupName);

    return Object.entries(group).reduce((acc, [value, subList]) => {
      const newPath = !!path ? path.concat('.', value) : value;
      // place group header
      const groupSize = getSize(subList);
      acc.push({ key: groupName, value, path: newPath, size: groupSize });
      const rowIndex = headerCount + expandedSize;
      loaded[rowIndex] = 'LOADED';

      // increase header count
      headerCount++;

      if (!expanded.includes(newPath)) {
        // add size to idPointer
        idPointer += getSize(subList);
        return acc;
      }

      const result = flattenGroup(
        subList,
        groupByProp.slice(1),
        expanded,
        newPath
      );

      return acc.concat(
        result.reduce((subAcc, e) => {
          if (groupByProp.length !== 1) {
            subAcc.push(e);
          } else {
            // last group element, to expand content
            for (let i = 0; i < e.size; i++) {
              subAcc.push(ids[idPointer]);

              const rowIndex = headerCount + expandedSize + i;
              dataMap[rowIndex] = idPointer;
              loaded[rowIndex] = loadedMap[idPointer];
              idPointer++;
            }
            expandedSize += e.size;
          }
          return subAcc;
        }, [])
      );
    }, []);
  };

  const flatten = flattenGroup(list, groupByProp, expanded);
  // console.log({ dataMap, loaded });
  // console.log({ loadedMap });
  return [flatten, loaded, dataMap];
};

const getIds = state => state.datagrid.members.ids;
const getTotalSize = state => state.datagrid.members.totalSize;
const getGroups = state => state.datagrid.members.groups;
const getLoadedMap = state => state.datagrid.members.loadedRowsMap;
const byId = state => state.datagrid.members.byId;

const getRows = createSelector(
  [
    getIds,
    getTotalSize,
    getGroups,
    (_, props) => props.groupBy,
    (_, props) => props.expanded,
    getLoadedMap
  ],
  (ids, totalSize, groups, groupBy = [], expanded = [], loadedMap = {}) => {
    if (groupBy.length === 0) {
      return nonGroup(totalSize, ids, loadedMap);
    }

    const result = impl(ids, loadedMap, groups, groupBy, expanded);
    // [rows, loaded, dataIndex]
    return result;
  }
);

export default { getRows, byId };
