import React from 'react';
import { connect } from 'react-redux';

import selector from 'selectors/datagridSelectorImpl';

class MemberDataCell extends React.Component {
  render() {
    return this.props.value || null;
  }
}

const mapStateToProps = (state, { id, field }) => {
  const value = selector.byId(state)[id][field];
  return { value };
};

export default connect(mapStateToProps)(MemberDataCell);
export { MemberDataCell };
