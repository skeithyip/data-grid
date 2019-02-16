import React from 'react';
import { ScrollSync, AutoSizer } from 'react-virtualized';
// import clsx from 'classnames';

import DataGridHeader from './DataGridHeader';

import 'react-virtualized/styles.css';
import styles from './ScrollSync.module.css';

import DataGridContent from './DataGridContent';

class DataGrid extends React.Component {
  constructor(props) {
    super(props);
    const totalWidth = this.props.columns.reduce(
      (acc, { width }) => acc + width,
      0
    );
    const columnWidths = this.props.columns.reduce((acc, { id, width }) => {
      acc[id] = width / totalWidth;
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

  onResizeColumn = ({ columnIndex, deltaX }) => {
    const { columns } = this.props;
    this.setState(({ columnWidths, totalWidth }) => {
      const { id: column } = columns[columnIndex];
      const percentDelta = deltaX / totalWidth;
      const { id: nextDataKey } = columns[columnIndex + 1];

      return {
        columnWidths: {
          ...columnWidths,
          [column]: columnWidths[column] + percentDelta,
          [nextDataKey]: columnWidths[nextDataKey] - percentDelta
        }
      };
    });
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
      loadMoreRows
    } = this.props;
    const columnCount = columns.length;

    return (
      <div className={styles.GridRow}>
        <ScrollSync>
          {({ onScroll, scrollLeft }) => (
            <div className={styles.GridColumn}>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div>
                    <DataGridHeader
                      height={rowHeight}
                      scrollLeft={scrollLeft}
                      onResizeColumn={this.onResizeColumn}
                      width={width}
                      columns={columns}
                      columnCount={columnCount}
                      rowHeight={rowHeight}
                      overscanColumnCount={overscanColumnCount}
                      totalWidth={totalWidth}
                      columnWidths={columnWidths}
                    />
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
                      groupBy={groupBy}
                      onGroupRowClick={this.onGroupRowClick}
                      expanded={expanded}
                      loadMoreRows={loadMoreRows}
                    />
                  </div>
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
