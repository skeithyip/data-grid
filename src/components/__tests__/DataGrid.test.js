import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ScrollSync, AutoSizer } from 'react-virtualized';

import DataGrid from '../DataGrid';
import DataGridContent from '../DataGridContent';
import DataGridHeader from '../DataGridHeader';

Enzyme.configure({ adapter: new Adapter() });

const getGridContent = (wrapper, onScroll, width) => {
  const scrollWrapper = wrapper.find(ScrollSync).renderProp('children')({
    onScroll
  });
  const contentWrapper = scrollWrapper
    .find(AutoSizer)
    .renderProp('children')({
      width
    })
    .find(DataGridContent);
  return contentWrapper;
};

const getGridHeader = (wrapper, scrollLeft, width) => {
  const scrollWrapper = wrapper.find(ScrollSync).renderProp('children')({
    scrollLeft
  });
  const contentWrapper = scrollWrapper
    .find(AutoSizer)
    .renderProp('children')({
      width
    })
    .find(DataGridHeader);
  return contentWrapper;
};

describe('DataGrid', () => {
  it('should render DataGridContent', () => {
    const onScroll = jest.fn();
    const props = {
      groupBy: [],
      columns: [
        { id: 'memberType', width: 150 },
        { id: 'id', width: 400 },
        { id: 'name', width: 200 },
        { id: 'shortname', width: 200 }
      ],
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    const contentWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(contentWrapper.is(DataGridContent)).toBeTruthy();
    expect(contentWrapper.props()).toMatchObject({
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
      columns: [
        { id: 'memberType', width: 150 },
        { id: 'id', width: 400 },
        { id: 'name', width: 200 },
        { id: 'shortname', width: 200 }
      ],
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    let contentWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(contentWrapper.props().expanded).toEqual([]);
    contentWrapper.simulate('groupRowClick', 'exchange');
    contentWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(contentWrapper.props().expanded).toEqual(['exchange']);
  });

  it('should remove existing expanded when onGroupRowClick', () => {
    const onScroll = jest.fn();
    const props = {
      groupBy: ['memberType'],
      columns: [
        { id: 'memberType', width: 150 },
        { id: 'id', width: 400 },
        { id: 'name', width: 200 },
        { id: 'shortname', width: 200 }
      ],
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    let contentWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(contentWrapper.props().expanded).toEqual([]);
    contentWrapper.simulate('groupRowClick', 'exchange');
    contentWrapper.simulate('groupRowClick', 'exchange');
    contentWrapper = getGridContent(mainWrapper, onScroll, 100);

    expect(contentWrapper.props().expanded).toEqual([]);
  });

  it('should render DataGridHeader', () => {
    const scrollLeft = jest.fn();
    const props = {
      groupBy: [],
      columns: [
        { id: 'memberType', width: 150 },
        { id: 'id', width: 400 },
        { id: 'name', width: 200 },
        { id: 'shortname', width: 200 }
      ],
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    const headerWrapper = getGridHeader(mainWrapper, scrollLeft, 100);

    expect(headerWrapper.is(DataGridHeader)).toBeTruthy();
    expect(headerWrapper.props()).toMatchObject({
      height: 40,
      scrollLeft,
      width: 100,
      columns: props.columns,
      columnCount: 4,
      rowHeight: 40,
      totalWidth: 950,
      columnWidths: expect.any(Object)
    });
  });

  it('should handle onResizeColumn', () => {
    const scrollLeft = jest.fn();
    const props = {
      groupBy: [],
      columns: [
        { id: 'memberType', width: 100 },
        { id: 'id', width: 100 },
        { id: 'name', width: 100 },
        { id: 'shortname', width: 100 }
      ],
      onRowClick: jest.fn(),
      rowComponent: () => <React.Fragment />,
      getRows: jest.fn(),
      loadMoreRows: jest.fn()
    };
    const mainWrapper = shallow(<DataGrid {...props} />);
    let headerWrapper = getGridHeader(mainWrapper, scrollLeft, 100);

    expect(headerWrapper.props().columnWidths).toEqual({
      memberType: 0.25,
      id: 0.25,
      name: 0.25,
      shortname: 0.25
    });

    headerWrapper.simulate('resizeColumn', { columnIndex: 0, deltaX: 1 });
    headerWrapper = getGridHeader(mainWrapper, scrollLeft, 100);

    expect(headerWrapper.props().columnWidths).toEqual({
      memberType: 0.2525,
      id: 0.2475,
      name: 0.25,
      shortname: 0.25
    });
  });
});
