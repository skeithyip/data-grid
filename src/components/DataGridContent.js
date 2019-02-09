import React from 'react';
import { InfiniteLoader, Grid } from 'react-virtualized';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './ScrollSync.module.css';
import DataGridCell from './DataGridCell';

class DataGridContent extends React.Component {
  infLoaderRef = React.createRef();
  gridRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.rowCount !== prevProps.rowCount) {
      this.resetLoadMoreRowsCache();
    }
  }

  resetLoadMoreRowsCache = () => {
    if (this.toResetCache) {
      // when range is visible, loadMoreRow will not be triggered
      // reset cache to force loadMoreRow
      this.infLoaderRef.current.resetLoadMoreRowsCache(true);
    }
    // if toResetCache is false, means it has been called. so no reset needed

    // set toResetCache flag to true everytime rowCount is updated
    // this ensures cache will be reset next time unless loadMoreRows is triggered
    this.toResetCache = true;
  };

  isRowLoaded = ({ index }) => {
    const { loadedMap } = this.props;
    // console.log('isRowLoaded', { loadedMap });

    return !!loadedMap[index];
  };

  // this will be called when rowCount is updated and before componentDidUpdate
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log('loadMoreRows');
    const { getRows, groupBy, expanded } = this.props;
    // turn off reset cache
    this.toResetCache = false;

    this.props.loadMoreRows({
      startIndex,
      stopIndex,
      getRows,
      groupBy,
      expanded
    });
  };

  onSectionRendered = props => {
    // apparently different from example..
    // default threshold is 15 therefore loadMoreRows stopIndex will be +15
    const { rowStartIndex, rowStopIndex } = props;
    const startIndex = rowStartIndex;
    const stopIndex = rowStopIndex;

    this.onRowsRendered({ startIndex, stopIndex });
  };

  columnWidth = ({ index }) => {
    const { totalWidth, columnWidths, columns } = this.props;
    const column = columns[index];
    return columnWidths[column] * totalWidth;
  };

  registerGridRef = register => el => {
    register(el);
    this.gridRef.current = el;
  };

  renderMainCell = ({ columnIndex, key, rowIndex, style }) => {
    const {
      columns,
      groupBy,
      expanded,
      onGroupRowClick,
      rowComponent,
      onRowClick,
      getRows
    } = this.props;

    return (
      <DataGridCell
        key={key}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        style={style}
        columns={columns}
        groupBy={groupBy}
        expanded={expanded}
        onGroupRowClick={onGroupRowClick}
        rowComponent={rowComponent}
        onRowClick={onRowClick}
        getRows={getRows}
      />
    );
  };

  render() {
    const {
      rowCount,
      height,
      width,
      columnCount,
      onScroll,
      overscanColumnCount,
      overscanRowCount,
      rowHeight
    } = this.props;

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={rowCount}
        ref={this.infLoaderRef}>
        {({ onRowsRendered, registerChild }) => {
          this.onRowsRendered = onRowsRendered;

          return (
            <div style={{ height, width }}>
              <Grid
                className={styles.BodyGrid}
                columnWidth={this.columnWidth}
                columnCount={columnCount}
                height={height}
                onScroll={onScroll}
                overscanColumnCount={overscanColumnCount}
                overscanRowCount={overscanRowCount}
                cellRenderer={this.renderMainCell}
                rowHeight={rowHeight}
                rowCount={rowCount}
                width={width}
                onSectionRendered={this.onSectionRendered}
                ref={this.registerGridRef(registerChild)}
              />
            </div>
          );
        }}
      </InfiniteLoader>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { getRows } = props;
  const [rows, , loadedMap] = getRows(state, props);

  return { rowCount: rows.length, loadedMap };
};
const mapDispatchToProps = (dispatch, { loadMoreRows }) =>
  bindActionCreators({ loadMoreRows }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataGridContent);
export { DataGridContent };
