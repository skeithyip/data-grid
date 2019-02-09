import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DataGridGroupCell from '../DataGridGroupCell';

Enzyme.configure({ adapter: new Adapter() });

describe('DataGridGroupCell', () => {
  it('should show cell', () => {
    const props = {
      showCell: true,
      row: { key: 'memberType', value: 'memberB', path: 'memberB' }
    };
    const wrapper = shallow(<DataGridGroupCell {...props} />);

    expect(wrapper.find('i')).toHaveLength(1);
  });

  it('should not show cell for unrelated columns', () => {
    const props = {
      showCell: false,
      row: { key: 'memberType', value: 'memberB', path: 'memberB' }
    };
    const wrapper = shallow(<DataGridGroupCell {...props} />);

    expect(wrapper.find('i')).toHaveLength(0);
  });

  it('should show expanded group', () => {
    const props = {
      showCell: true,
      row: { key: 'memberType', value: 'memberB', path: 'memberB' }
    };
    const wrapper = shallow(<DataGridGroupCell {...props} />);

    expect(wrapper.find('i.collapse')).toHaveLength(1);

    wrapper.setProps({ expanded: true });

    expect(wrapper.find('i.expanded')).toHaveLength(1);
  });

  it('should have hover class when hovered', () => {
    const props = {
      showCell: true,
      row: { key: 'memberType', value: 'memberB', path: 'memberB' }
    };
    const wrapper = shallow(<DataGridGroupCell {...props} />);

    expect(wrapper.props().className).toBe('cell groupHeaderCell pointer');

    wrapper.setProps({ hovered: true });

    expect(wrapper.props().className).toBe(
      'cell groupHeaderCell pointer hovered'
    );
  });

  it('should handle onClick', () => {
    const props = {
      showCell: true,
      row: { key: 'memberType', value: 'memberB', path: 'memberB' },
      onClick: jest.fn()
    };
    const wrapper = shallow(<DataGridGroupCell {...props} />);
    wrapper.simulate('click');

    expect(props.onClick).toHaveBeenCalledTimes(1);
    expect(props.onClick).lastCalledWith('memberB');
  });
});
