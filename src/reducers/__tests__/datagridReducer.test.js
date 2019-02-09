import reducer from '../datagridReducer';

it('should return initial state', () => {
  const result = reducer(undefined, {});

  expect(result.members.totalSize).toBe(0);
  expect(result.members.ids).toHaveLength(0);
});

it('should return initial state', () => {
  const intitialState = reducer(undefined, {});
  const result = reducer(intitialState, {
    type: 'FETCH_MORE_DATA',
    payload: { dataStart: 5, dataEnd: 9 }
  });

  expect(result.members.totalSize).toBe(0);
  expect(result.members.ids).toHaveLength(10);
  expect(result.members.ids).toEqual([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    expect.any(String),
    expect.any(String),
    expect.any(String),
    expect.any(String),
    expect.any(String)
  ]);
  Object.entries(result.members.byId).forEach(([, value]) => {
    expect(value.memberType).toBe('memberTypeA');
  });
});
