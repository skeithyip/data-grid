import React from 'react';

import DataGrid from 'components/DataGrid';
import MemberDataCell from './MemberDataCell';
import selector from 'selectors/datagridSelectorImpl';
import loadMoreRows from 'actions/loadMoreRowsAction';

class DataGridContainer extends React.Component {
  state = {
    // groupBy: [],
    groupBy: ['memberType'],
    // columns: ['id', 'name', 'shortname', 'memberType'],
    columns: ['memberType', 'id', 'name', 'shortname'],
    columnWidths: { id: 400, name: 200, shortname: 200, memberType: 150 }
  };

  onRowClick = id => console.log(id);

  render() {
    const { groupBy, columns, columnWidths } = this.state;

    return (
      <DataGrid
        groupBy={groupBy}
        columns={columns}
        columnWidths={columnWidths}
        onRowClick={this.onRowClick}
        rowComponent={MemberDataCell}
        // selectors
        getRows={selector.getRows}
        // dispatch action
        loadMoreRows={loadMoreRows}
      />
    );
  }
}

export default DataGridContainer;
