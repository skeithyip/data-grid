import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MemberDataGrid from '../MemberDataGrid';
import DataGrid from 'components/DataGrid';

Enzyme.configure({ adapter: new Adapter() });

describe('MemberDataGrid', () => {
  it('should render DataGrid', () => {
    const wrapper = shallow(<MemberDataGrid />);

    expect(wrapper.is(DataGrid)).toBeTruthy();
  });

  it('should handle onClick', () => {
    const wrapper = shallow(<MemberDataGrid />);
    wrapper.simulate('rowClick', 'member1');
  });
});
