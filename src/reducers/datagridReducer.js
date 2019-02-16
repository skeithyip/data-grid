import memoizeOne from 'memoize-one';
import { sample } from 'lodash';
import produce from 'immer';

import { PREPARE_MORE_DATA, FETCH_MORE_DATA } from 'actions/loadMoreRowsAction';

const stateImpl = memoizeOne((genSize, totalSize, groups) => {
  return {
    members: [...Array(genSize)]
      .map((_, index) => ({
        id: `member_index${index}`,
        name: `member${index}`,
        shortname: `shortname${index}`,
        memberType: sample(['memberTypeA', 'memberTypeB', 'memberTypeC'])
      }))
      .reduce(
        (acc, e) => {
          acc.ids.push(e.id);
          acc.byId[e.id] = e;

          return acc;
        },
        { byId: {}, ids: [], groups, totalSize, loadedRowsMap: {} }
      )
  };
});
const groups = [
  { memberType: 'memberTypeA', size: 10 },
  { memberType: 'memberTypeB', size: 20 },
  { memberType: 'memberTypeC', size: 100 }
];
// const initialState = stateImpl(5, 50, []);
const initialState = stateImpl(0, 0, groups);

const fill = (original, startIndex, stopIndex) => {
  const range = stopIndex - startIndex + 1;
  const { groups } = original.members;

  return produce(original, draft => {
    let groupStartRange = 0;
    let foundGroup;

    for (let i = 0; i < groups.length; i++) {
      const { size } = groups[i];
      if (
        groupStartRange <= startIndex &&
        groupStartRange + size >= stopIndex
      ) {
        foundGroup = groups[i];
        break;
      }
      groupStartRange += groups[i].size;
    }

    for (let i = 0; i < range; i++) {
      const id = `member_index${i + startIndex}`;
      if (draft.members.ids.includes(id)) {
        continue;
      }

      const memberType = foundGroup
        ? foundGroup.memberType
        : sample(['memberTypeA', 'memberTypeB', 'memberTypeC']);

      const member = {
        id,
        name: `${memberType}_${i + startIndex}`,
        shortname: `shortname${i + startIndex}`,
        memberType
      };

      draft.members.ids[i + startIndex] = id;
      draft.members.byId[id] = member;
    }
  });
};

// const LOADED = 'LOADED';
const LOADING = 'LOADING';

const addLoading = (original, startIndex, stopIndex) => {
  return produce(original, draft => {
    for (let i = startIndex; i <= stopIndex; i++) {
      draft.members.loadedRowsMap[i] = LOADING;
    }
  });
};

const datagrid = (state = initialState, action) => {
  switch (action.type) {
    case PREPARE_MORE_DATA: {
      const {
        payload: { dataStart, dataEnd }
      } = action;
      return addLoading(state, dataStart, dataEnd);
    }
    case FETCH_MORE_DATA: {
      const {
        payload: { dataStart, dataEnd }
      } = action;
      return fill(state, dataStart, dataEnd);
    }
    default:
      return state;
  }
};

export default datagrid;
