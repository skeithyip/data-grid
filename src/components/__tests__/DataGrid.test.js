import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ScrollSync, AutoSizer } from 'react-virtualized';

import DataGrid from '../DataGrid';
import DataGridContent from '../DataGridContent';

Enzyme.configure({ adapter: new Adapter() });

const getGridContent = (wrapper, onScroll, width) => {
  const scrollWrapper = wrapper.find(ScrollSync).renderProp('children')({
    onScroll
  });
  const sizerWrapper = scrollWrapper.find(AutoSizer).renderProp('children')({
    width
  });
  return sizerWrapper;
};

describe('DataGrid', () => {
  it('should render DataGridContent', () => {
    const onScroll = jest.fn();
    const props = {
      groupBy: [],
      columns: ['memberType', 'id', 'name', 'shortname'],
      columnWidths: { id: 400, name: 200, shortname: 200, memberType: 150 },
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    const sizerWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(sizerWrapper.is(DataGridContent)).toBeTruthy();
    expect(sizerWrapper.props()).toMatchObject({
      width: 100,
      columnCount: 4,
      onScroll,
      totalWidth: 950,
      columnWidths: expect.any(Object),
      columns: props.columns,
      rowComponent: props.rowComponent,
      onRowClick: props.onRowClick,
      getRows: props.getRows,
      groupBy: props.groupBy,
      loadMoreRows: props.loadMoreRows,
      expanded: []
    });
  });

  it('should add to expanded when onGroupRowClick', () => {
    const onScroll = jest.fn();
    const props = {
      groupBy: ['memberType'],
      columns: ['memberType', 'id', 'name', 'shortname'],
      columnWidths: { id: 400, name: 200, shortname: 200, memberType: 150 },
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    let sizerWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(sizerWrapper.props().expanded).toEqual([]);
    sizerWrapper.simulate('groupRowClick', 'exchange');
    sizerWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(sizerWrapper.props().expanded).toEqual(['exchange']);
  });

  it('should remove existing expanded when onGroupRowClick', () => {
    const onScroll = jest.fn();
    const props = {
      groupBy: ['memberType'],
      columns: ['memberType', 'id', 'name', 'shortname'],
      columnWidths: { id: 400, name: 200, shortname: 200, memberType: 150 },
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    let sizerWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(sizerWrapper.props().expanded).toEqual([]);
    sizerWrapper.simulate('groupRowClick', 'exchange');
    sizerWrapper.simulate('groupRowClick', 'exchange');
    sizerWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(sizerWrapper.props().expanded).toEqual([]);
  });
});
