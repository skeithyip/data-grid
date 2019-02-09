import React from 'react';
import { ScrollSync, AutoSizer } from 'react-virtualized';
// import clsx from 'classnames';

import 'react-virtualized/styles.css';
import styles from './ScrollSync.module.css';

import DataGridContent from './DataGridContent';

class DataGrid extends React.Component {
  constructor(props) {
    super(props);
    const totalWidth = this.props.columns
      .map(e => this.props.columnWidths[e])
      .reduce((acc, e) => acc + e, 0);
    const columnWidths = this.props.columns.reduce((acc, e) => {
      const width = this.props.columnWidths[e];
      acc[e] = width / totalWidth;
      return acc;
    }, {});

    this.state = {
      columnWidth: 75,
      columnCount: 50,
      height: 900,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      leftColumnCount: 0,
      totalWidth,
      columnWidths,
      expanded: []
    };
  }

  onGroupRowClick = path => {
    const { expanded } = this.state;
    if (expanded.includes(path)) {
      this.setState({ expanded: expanded.filter(e => e !== path) });
    } else {
      this.setState({ expanded: [...expanded, path] });
    }
  };

  render() {
    const {
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      totalWidth,
      columnWidths,
      expanded
    } = this.state;
    const {
      columns,
      rowComponent,
      onRowClick,
      groupBy,
      getRows,
      getRowCount,
      loadMoreRows
    } = this.props;
    const columnCount = columns.length;

    return (
      <div className={styles.GridRow}>
        <ScrollSync>
          {({ onScroll }) => (
            <div className={styles.GridColumn}>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <DataGridContent
                    height={height}
                    width={width}
                    columnCount={columnCount}
                    onScroll={onScroll}
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    rowHeight={rowHeight}
                    totalWidth={totalWidth}
                    columnWidths={columnWidths}
                    columns={columns}
                    rowComponent={rowComponent}
                    onRowClick={onRowClick}
                    getRows={getRows}
                    getRowCount={getRowCount}
                    groupBy={groupBy}
                    onGroupRowClick={this.onGroupRowClick}
                    expanded={expanded}
                    loadMoreRows={loadMoreRows}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </ScrollSync>
      </div>
    );
  }
}

export default DataGrid;
