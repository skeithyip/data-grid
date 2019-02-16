import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Draggable from 'react-draggable';
import { Grid } from 'react-virtualized';

import DataGridHeader, { DraggableGridHeader } from '../DataGridHeader';

Enzyme.configure({ adapter: new Adapter() });

describe('DraggableGridHeader', () => {
  it('should not render for last element', () => {
    const props = {
      columns: [{ id: 'name' }, { id: 'type' }],
      columnIndex: 1
    };
    const wrapper = shallow(<DraggableGridHeader {...props} />);

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('should render Draggable', () => {
    const props = {
      columns: [{ id: 'name' }, { id: 'type' }],
      columnIndex: 0
    };
    const wrapper = shallow(<DraggableGridHeader {...props} />);

    expect(wrapper.is(Draggable)).toBeTruthy();
  });

  it('should handle onResizeColumn', () => {
    const props = {
      columns: [{ id: 'name' }, { id: 'type' }],
      columnIndex: 0,
      onResizeColumn: jest.fn()
    };
    const wrapper = shallow(<DraggableGridHeader {...props} />);
    wrapper.simulate('drag', undefined, { deltaX: 1 });

    expect(props.onResizeColumn).toHaveBeenCalledTimes(1);
    expect(props.onResizeColumn).lastCalledWith({ columnIndex: 0, deltaX: 1 });
  });
});

describe('DataGridHeader', () => {
  let recomputeGridSize;
  beforeEach(() => {
    recomputeGridSize = jest.fn();
    jest.spyOn(React, 'createRef').mockImplementation(() => ({
      current: { recomputeGridSize }
    }));
  });

  afterEach(() => {
    React.createRef.mockRestore();
  });

  it('should render Grid', () => {
    const props = {
      columnCount: 4,
      rowHeight: 40,
      overscanColumnCount: 15,
      scrollLeft: 2,
      width: 100
    };
    const wrapper = shallow(<DataGridHeader {...props} />);

    expect(wrapper.find(Grid)).toHaveLength(1);
  });

  it('should recomputeGridSize on columnWidths change', () => {
    const columnWidths = { id: 0.25, name: 0.75 };
    const props = {
      columnCount: 4,
      rowHeight: 40,
      overscanColumnCount: 15,
      scrollLeft: 2,
      width: 100,
      columnWidths
    };
    const wrapper = shallow(<DataGridHeader {...props} />);
    expect(recomputeGridSize).toHaveBeenCalledTimes(0);

    wrapper.setProps({ columnWidths: { id: 0.75, name: 0.25 } });

    expect(recomputeGridSize).toHaveBeenCalledTimes(1);
  });

  it('should not recomputeGridSize on no columnWidths change', () => {
    const columnWidths = { id: 0.25, name: 0.75 };
    const props = {
      columnCount: 4,
      rowHeight: 40,
      overscanColumnCount: 15,
      scrollLeft: 2,
      width: 100,
      columnWidths
    };
    const wrapper = shallow(<DataGridHeader {...props} />);
    expect(recomputeGridSize).toHaveBeenCalledTimes(0);

    wrapper.setProps({ columnWidths });

    expect(recomputeGridSize).toHaveBeenCalledTimes(0);
  });

  it('should handle columnWidths', () => {
    const columns = [{ id: 'id' }, { id: 'name' }];
    const columnWidths = { id: 0.25, name: 0.75 };
    const props = {
      columnCount: 4,
      rowHeight: 40,
      overscanColumnCount: 15,
      scrollLeft: 2,
      width: 100,
      columns,
      columnWidths,
      totalWidth: 100
    };
    const wrapper = shallow(<DataGridHeader {...props} />);
    const result = wrapper
      .find(Grid)
      .props()
      .columnWidth({ index: 0 });

    expect(result).toBe(25);
  });

  it('should handle cellRenderer', () => {
    const columns = [{ id: 'id' }, { id: 'name' }];
    const props = {
      columnCount: 4,
      rowHeight: 40,
      overscanColumnCount: 15,
      scrollLeft: 2,
      width: 100,
      columns,
      onResizeColumn: jest.fn()
    };
    const wrapper = shallow(<DataGridHeader {...props} />);
    const cellWrapper = wrapper.find(Grid).renderProp('cellRenderer')({
      columnIndex: 0,
      key: '0-0',
      style: {}
    });

    expect(cellWrapper.find(DraggableGridHeader)).toHaveLength(1);
    expect(cellWrapper.find(DraggableGridHeader).props()).toMatchObject({
      columnIndex: 0,
      onResizeColumn: props.onResizeColumn,
      columns: props.columns
    });
  });
});
