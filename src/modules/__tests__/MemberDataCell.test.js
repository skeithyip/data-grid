import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';

import Connected, { MemberDataCell } from '../MemberDataCell';
import selector from 'selectors/datagridSelectorImpl';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('selectors/datagridSelectorImpl');

describe('MemberDataCell', () => {
  it('should return value', () => {
    const value = 'memberTypeB';
    const wrapper = shallow(<MemberDataCell value={value} />);

    expect(wrapper.text()).toBe(value);
  });

  it('should return null', () => {
    const wrapper = shallow(<MemberDataCell />);

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });
});

describe('Connected', () => {
  it('should have value as props', () => {
    selector.byId.mockReturnValue({
      member1: { memberType: 'memberTypeA', name: 'member1', shortName: 's1' },
      member2: { memberType: 'memberTypeB', name: 'member2', shortName: 's2' },
      member3: { memberType: 'memberTypeC', name: 'member3', shortName: 's3' }
    });

    const store = configureStore()();
    const wrapper = shallow(
      <Connected store={store} id="member2" field="memberType" />
    );

    expect(wrapper.props().value).toBe('memberTypeB');
  });
});
