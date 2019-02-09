import selector from '../datagridSelectorImpl';
import byId from './simpleMembers.json';
import ids from './simpleMembersId.json';

describe('getRows', () => {
  it('should return array and filled up with undefined', () => {
    const state = { datagrid: { members: { byId, ids, totalSize: 10 } } };
    const [rows, dataIndex] = selector.getRows(state, {});

    expect(rows).toHaveLength(10);
    expect(rows).toEqual([
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
    expect(dataIndex).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return array of formatted groups when props contains groupBy', () => {
    const groups = [
      { memberType: 'memberTypeA', size: 100 },
      { memberType: 'memberTypeB', size: 200 },
      { memberType: 'memberTypeC', size: 300 }
    ];
    const state = {
      datagrid: { members: { byId, ids, totalSize: 10, groups } }
    };
    const props = { groupBy: ['memberType'] };
    const [rows, dataIndex] = selector.getRows(state, props);

    expect(rows).toHaveLength(3);
    expect(rows).toEqual([
      { key: 'memberType', value: 'memberTypeA', path: 'memberTypeA' },
      { key: 'memberType', value: 'memberTypeB', path: 'memberTypeB' },
      { key: 'memberType', value: 'memberTypeC', path: 'memberTypeC' }
    ]);
    expect(dataIndex).toEqual({});
  });

  it('should return array of formatted groups when expanded is defined', () => {
    const groups = [
      { memberType: 'memberTypeA', size: 5 },
      { memberType: 'memberTypeB', size: 20 },
      { memberType: 'memberTypeC', size: 30 }
    ];
    const state = {
      datagrid: { members: { byId, ids: [], totalSize: 10, groups } }
    };
    const props = { groupBy: ['memberType'], expanded: ['memberTypeA'] };
    const [rows, dataIndex] = selector.getRows(state, props);

    expect(rows).toHaveLength(8);
    expect(rows).toEqual([
      { key: 'memberType', value: 'memberTypeA', path: 'memberTypeA' },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { key: 'memberType', value: 'memberTypeB', path: 'memberTypeB' },
      { key: 'memberType', value: 'memberTypeC', path: 'memberTypeC' }
    ]);
    expect(dataIndex).toEqual({ 0: undefined, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 });
  });

  it('should return array of formatted groups when expanded and ids are defined', () => {
    const groups = [
      { memberType: 'memberTypeA', size: 5 },
      { memberType: 'memberTypeB', size: 10 },
      { memberType: 'memberTypeC', size: 20 }
    ];
    const ids = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '5c47e15a48546954e43c4b2c',
      '5c47e15ab5ea0b3e8cf1ff09',
      '5c47e15a56de3d7daa4d0e29',
      '5c47e15a9e843e2ae418f237'
    ];
    const state = {
      datagrid: { members: { byId, ids, totalSize: 10, groups } }
    };
    const props = { groupBy: ['memberType'], expanded: ['memberTypeB'] };
    const [rows, dataIndex] = selector.getRows(state, props);

    expect(rows).toHaveLength(13);
    expect(rows).toEqual([
      { key: 'memberType', value: 'memberTypeA', path: 'memberTypeA' },
      { key: 'memberType', value: 'memberTypeB', path: 'memberTypeB' },
      '5c47e15a48546954e43c4b2c',
      '5c47e15ab5ea0b3e8cf1ff09',
      '5c47e15a56de3d7daa4d0e29',
      '5c47e15a9e843e2ae418f237',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { key: 'memberType', value: 'memberTypeC', path: 'memberTypeC' }
    ]);
    expect(dataIndex).toEqual({
      0: undefined,
      1: undefined,
      2: 5,
      3: 6,
      4: 7,
      5: 8,
      6: 9,
      7: 10,
      8: 11,
      9: 12,
      10: 13,
      11: 14
    });
  });

  it('should return array of formatted groups with multiple expanded', () => {
    const groups = [
      { memberType: 'memberTypeA', size: 5 },
      { memberType: 'memberTypeB', size: 10 },
      { memberType: 'memberTypeC', size: 20 }
    ];
    const ids = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '5c47e15a48546954e43c4b2c',
      '5c47e15ab5ea0b3e8cf1ff09',
      '5c47e15a56de3d7daa4d0e29',
      '5c47e15a9e843e2ae418f237'
    ];
    const state = {
      datagrid: { members: { byId, ids, totalSize: 10, groups } }
    };
    const props = {
      groupBy: ['memberType'],
      expanded: ['memberTypeA', 'memberTypeB']
    };
    const [rows, dataIndex] = selector.getRows(state, props);

    expect(rows).toHaveLength(18);
    expect(rows).toEqual([
      { key: 'memberType', value: 'memberTypeA', path: 'memberTypeA' },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { key: 'memberType', value: 'memberTypeB', path: 'memberTypeB' },
      '5c47e15a48546954e43c4b2c',
      '5c47e15ab5ea0b3e8cf1ff09',
      '5c47e15a56de3d7daa4d0e29',
      '5c47e15a9e843e2ae418f237',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { key: 'memberType', value: 'memberTypeC', path: 'memberTypeC' }
    ]);
    expect(dataIndex).toEqual({
      0: undefined,
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: undefined,
      7: 5,
      8: 6,
      9: 7,
      10: 8,
      11: 9,
      12: 10,
      13: 11,
      14: 12,
      15: 13,
      16: 14
    });
  });

  it('should return array of formatted groups and subgroup is not expanded', () => {
    const groups = [
      { memberType: 'memberTypeA', id: 'member0', size: 1 },
      { memberType: 'memberTypeA', id: 'member1', size: 1 }
    ];

    const state = {
      datagrid: { members: { byId, ids, totalSize: 10, groups } }
    };
    const props = { groupBy: ['memberType', 'id'], expanded: [] };
    const [rows, dataIndex] = selector.getRows(state, props);

    expect(rows).toHaveLength(1);
    expect(dataIndex).toEqual({});
  });

  it('should return array of formatted groups and subgroup is expanded', () => {
    const groups = [
      {
        memberType: 'memberTypeA',
        internalEntity: true,
        id: '5c47e15a48546954e43c4b2c',
        size: 1
      },
      {
        memberType: 'memberTypeA',
        internalEntity: true,
        id: '5c47e15ab5ea0b3e8cf1ff09',
        size: 1
      },
      {
        memberType: 'memberTypeB',
        internalEntity: true,
        id: '5c47e15a56de3d7daa4d0e29',
        size: 1
      },
      {
        memberType: 'memberTypeB',
        internalEntity: true,
        id: '5c47e15a9e843e2ae418f237',
        size: 1
      }
    ];

    const loadedRowsMap = { 2: 'LOADING' };
    const state = {
      datagrid: {
        members: { byId, ids, totalSize: 10, groups, loadedRowsMap }
      }
    };
    const props = {
      groupBy: ['memberType', 'internalEntity', 'id'],
      expanded: [
        'memberTypeB',
        'memberTypeB.true',
        'memberTypeB.true.5c47e15a56de3d7daa4d0e29'
      ]
    };
    const [rows, dataMap, loaded] = selector.getRows(state, props);

    expect(rows).toHaveLength(6);
    expect(dataMap).toEqual({ 4: 2 });
    expect(loaded).toEqual([
      'LOADED',
      'LOADED',
      'LOADED',
      'LOADED',
      'LOADING',
      'LOADED'
    ]);
  });
});
