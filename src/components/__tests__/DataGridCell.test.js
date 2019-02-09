import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';

import Connected, { DataGridCell } from '../DataGridCell';
import DataGridGroupCell from '../DataGridGroupCell';

Enzyme.configure({ adapter: new Adapter() });

const RowComponent = () => <React.Fragment />;

describe('DataGridCell', () => {
  it('should render rowComponent', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      row: 'member1',
      columnIndex: 2,
      rowComponent: RowComponent
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    expect(wrapper.find(RowComponent)).toHaveLength(1);
    expect(wrapper.find(RowComponent).props()).toEqual({
      id: 'member1',
      field: 'name'
    });
  });

  it('should handle onClick', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      row: 'member1',
      onRowClick: jest.fn(),
      columnIndex: 2,
      rowComponent: RowComponent
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    wrapper.simulate('click');
    expect(props.onRowClick).toHaveBeenCalledTimes(1);
    expect(props.onRowClick).lastCalledWith('member1');
    expect(wrapper.props().className).toBe('cell pointer');
  });

  it('should have hover class when hovered', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      row: 'member1',
      columnIndex: 2,
      rowComponent: RowComponent,
      hovered: true
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    expect(wrapper.props().className).toBe('cell hovered');
  });

  it('should render placeholder only for 1st column when row is not ready', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      row: undefined,
      columnIndex: 0,
      rowComponent: RowComponent
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    expect(wrapper.find('div.placeholder')).toHaveLength(1);
  });

  it('should not render placeholder for non-1st column when row is not ready', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      row: undefined,
      columnIndex: 2,
      rowComponent: RowComponent
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    expect(wrapper.find('div.placeholder')).toHaveLength(0);
  });

  it('should render DataGridGroupCell for group row', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      columnIndex: 0,
      row: { key: 'memberType', value: 'exchange', path: 'exchange' },
      onGroupRowClick: jest.fn(),
      expanded: ['exchange'],
      hovered: true
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    expect(wrapper.is(DataGridGroupCell)).toBeTruthy();
    expect(wrapper.props()).toMatchObject({
      row: props.row,
      onClick: props.onGroupRowClick,
      expanded: true,
      showCell: true,
      hovered: true
    });
  });

  it('should handle mouseOver for group row', () => {
    const props = {
      columns: ['memberType', 'id', 'name', 'shortname'],
      rowIndex: 10,
      columnIndex: 0,
      row: { key: 'memberType', value: 'exchange', path: 'exchange' },
      onMouseOver: jest.fn(),
      onGroupRowClick: jest.fn(),
      expanded: ['exchange'],
      hovered: true
    };
    const wrapper = shallow(<DataGridCell {...props} />);
    wrapper.simulate('mouseOver');

    expect(props.onMouseOver).toHaveBeenCalledTimes(1);
    expect(props.onMouseOver).lastCalledWith(10);
  });
});

describe('connected', () => {
  it('should assign 2nd element from getRows as props', () => {
    const rowIndex = 1;
    const getRows = jest.fn(() => [['rowA', 'rowB']]);
    const props = { rowIndex, getRows };
    const store = configureStore()();
    const wrapper = shallow(<Connected store={store} {...props} />);

    expect(wrapper.props().row).toBe('rowB');
  });
});
