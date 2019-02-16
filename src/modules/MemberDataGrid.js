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
    columns: [
      { id: 'memberType', label: 'Member Type', width: 150 },
      { id: 'id', label: 'ID', width: 400 },
      { id: 'name', label: 'Member Name', width: 200 },
      { id: 'shortname', label: 'S_Name', width: 200 }
      //{ id: 'fieldA', label: 'Field_A', width: 200 },
      //{ id: 'fieldB', label: 'Field_B', width: 200 }
    ]
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
