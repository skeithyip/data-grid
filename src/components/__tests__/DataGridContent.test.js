import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { InfiniteLoader, Grid } from 'react-virtualized';

import Connected, { DataGridContent } from '../DataGridContent';
import DataGridCell from '../DataGridCell';

Enzyme.configure({ adapter: new Adapter() });

describe('DataGridContent', () => {
  let resetLoadMoreRowsCache;
  beforeEach(() => {
    resetLoadMoreRowsCache = jest.fn();
    jest.spyOn(React, 'createRef').mockImplementation(() => ({
      current: { resetLoadMoreRowsCache }
    }));
  });

  afterEach(() => {
    React.createRef.mockRestore();
  });

  it('should render InfiniteLoader and Grid', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10
    };
    const wrapper = shallow(<DataGridContent {...props} />);

    expect(wrapper.is(InfiniteLoader)).toBeTruthy();
    expect(wrapper.props().rowCount).toBe(props.rowCount);

    const onRowsRendered = jest.fn();
    const registerChild = jest.fn();
    const gridContainer = wrapper.renderProp('children')({
      onRowsRendered,
      registerChild
    });

    expect(gridContainer.find(Grid)).toHaveLength(1);
    const gridWrapper = gridContainer.find(Grid);

    expect(gridWrapper.props()).toMatchObject({
      columnCount: 5,
      height: 500,
      onScroll: props.onScroll,
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      rowCount: 100,
      width: 400
    });
  });

  it('should handle isRowLoaded', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      loadedMap: ['LOADED', undefined, 'LOADED']
    };
    const wrapper = shallow(<DataGridContent {...props} />);

    expect(wrapper.props().isRowLoaded({ index: 1 })).toBeFalsy();
  });

  it('should handle loadMoreRows', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      loadMoreRows: jest.fn(),
      getRows: jest.fn(),
      groupBy: ['member'],
      expanded: ['memberB']
    };
    const wrapper = shallow(<DataGridContent {...props} />);
    wrapper.props().loadMoreRows({ startIndex: 0, stopIndex: 9 });

    expect(props.loadMoreRows).toHaveBeenCalledTimes(1);
    expect(props.loadMoreRows).lastCalledWith({
      startIndex: 0,
      stopIndex: 9,
      getRows: props.getRows,
      groupBy: props.groupBy,
      expanded: props.expanded
    });
  });

  it('should handle onSectionRendered', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10
    };
    const wrapper = shallow(<DataGridContent {...props} />);

    const onRowsRendered = jest.fn();
    const registerChild = jest.fn();
    const gridContainer = wrapper.renderProp('children')({
      onRowsRendered,
      registerChild
    });
    const gridWrapper = gridContainer.find(Grid);
    gridWrapper
      .props()
      .onSectionRendered({ rowStartIndex: 0, rowStopIndex: 9 });

    expect(onRowsRendered).toHaveBeenCalledTimes(1);
    expect(onRowsRendered).lastCalledWith({ startIndex: 0, stopIndex: 9 });
  });

  it('should handle columnWidth', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      totalWidth: 400,
      columnWidths: { memberType: 0.5, id: 0.25, name: 0.25 },
      columns: ['memberType', 'id', 'name']
    };
    const wrapper = shallow(<DataGridContent {...props} />);

    const onRowsRendered = jest.fn();
    const registerChild = jest.fn();
    const gridContainer = wrapper.renderProp('children')({
      onRowsRendered,
      registerChild
    });
    const gridWrapper = gridContainer.find(Grid);

    expect(gridWrapper.props().columnWidth({ index: 0 })).toBe(200);
  });

  it('should handle registerGridRef', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10
    };
    const wrapper = shallow(<DataGridContent {...props} />);
    const el = jest.fn();
    wrapper.instance().registerGridRef(jest.fn())(el);
    // nothing we can do since we are mocking our dependencies
  });

  it('should call resetLoadMoreRowsCache on rowCount change if loadMoreRow is not called', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10
    };
    const wrapper = shallow(<DataGridContent {...props} />);
    wrapper.setProps({ rowCount: 200 });
    wrapper.setProps({ rowCount: 100 });

    expect(resetLoadMoreRowsCache).toHaveBeenCalledTimes(1);
  });

  it('should not call resetLoadMoreRowsCache on rowCount change after loadMoreRow', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      loadMoreRows: jest.fn()
    };
    const wrapper = shallow(<DataGridContent {...props} />);
    wrapper.setProps({ rowCount: 200 });
    wrapper.instance().loadMoreRows({ startIndex: 0, stopIndex: 199 });
    wrapper.setProps({ rowCount: 100 });

    expect(resetLoadMoreRowsCache).toHaveBeenCalledTimes(0);
  });

  it('should not call resetLoadMoreRowsCache when rowCount is not changed', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      loadMoreRows: jest.fn()
    };
    const wrapper = shallow(<DataGridContent {...props} />);
    wrapper.setProps({ rowCount: 100 });

    expect(resetLoadMoreRowsCache).toHaveBeenCalledTimes(0);
  });

  it('should handle renderMainCell', () => {
    const props = {
      rowCount: 100,
      height: 500,
      width: 400,
      columnCount: 5,
      onScroll: jest.fn(),
      overscanColumnCount: 15,
      overscanRowCount: 15,
      rowHeight: 10,
      columns: ['memberType', 'id', 'name'],
      groupBy: ['memberType'],
      expanded: ['memberTypeB'],
      onGroupRowClick: jest.fn(),
      rowComponent: <React.Fragment />,
      onRowClick: jest.fn(),
      getRows: jest.fn()
    };
    const wrapper = shallow(<DataGridContent {...props} />);

    expect(wrapper.is(InfiniteLoader)).toBeTruthy();
    expect(wrapper.props().rowCount).toBe(props.rowCount);

    const onRowsRendered = jest.fn();
    const registerChild = jest.fn();
    const gridContainer = wrapper.renderProp('children')({
      onRowsRendered,
      registerChild
    });

    expect(gridContainer.find(Grid)).toHaveLength(1);
    const gridWrapper = gridContainer.find(Grid);
    const cellWrapper = gridWrapper.renderProp('cellRenderer')({
      columnIndex: 1,
      key: '1-1',
      rowIndex: 1,
      style: {}
    });

    expect(cellWrapper.is(DataGridCell)).toBeTruthy();
    expect(cellWrapper.props()).toMatchObject({
      rowIndex: 1,
      columnIndex: 1,
      columns: props.columns,
      groupBy: props.groupBy,
      expanded: props.expanded,
      onGroupRowClick: props.onGroupRowClick,
      rowComponent: props.rowComponent,
      onRowClick: props.onRowClick,
      getRows: props.getRows
    });
  });
});

describe('Connected', () => {
  it('should assign rowCount and loadedMap as props', () => {
    const loadedMap = ['LOADED', undefined, 'LOADED'];
    const getRows = jest.fn(() => [['rowA', 'rowB'], undefined, loadedMap]);
    const props = { getRows };
    const store = configureStore()();
    const wrapper = shallow(<Connected store={store} {...props} />);

    expect(wrapper.props().rowCount).toBe(2);
    expect(wrapper.props().loadedMap).toBe(loadedMap);
  });
});
