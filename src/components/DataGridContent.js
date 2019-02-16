import React from 'react';
import { InfiniteLoader, Grid } from 'react-virtualized';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './ScrollSync.module.css';
import DataGridCell from './DataGridCell';

class DataGridContent extends React.Component {
  state = {};
  infLoaderRef = React.createRef();
  gridRef = React.createRef();

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.rowCount !== this.props.rowCount) {
      // reset cache on row count diff
      // this flag will become false if loadMoreRows is called
      this.toResetCache = true;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.toResetCache && this.props.rowCount !== prevProps.rowCount) {
      // console.log('componentDidUpdate rowCount');
      // when range is visible, loadMoreRow will not be triggered
      // reset cache to force loadMoreRow
      this.infLoaderRef.current.resetLoadMoreRowsCache(true);
    }

    if (this.state.hoveredRowIndex !== prevState.hoveredRowIndex) {
      this.gridRef.current.forceUpdate();
    }

    if (this.props.columnWidths !== prevProps.columnWidths) {
      this.gridRef.current.recomputeGridSize();
    }
  }

  onMouseOver = hoveredRowIndex => {
    this.setState(() => ({ hoveredRowIndex }));
  };

  onMouseOut = () => {
    this.setState(() => ({ hoveredRowIndex: undefined }));
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

    // disable reset of cache
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
    const { id: column } = columns[index];
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
    const { hoveredRowIndex } = this.state;

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
        onMouseOver={this.onMouseOver}
        hovered={rowIndex === hoveredRowIndex}
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
            <div style={{ height, width }} onMouseOut={this.onMouseOut}>
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
  const [rows, loadedMap] = getRows(state, props);

  return { rowCount: rows.length, loadedMap };
};
const mapDispatchToProps = (dispatch, { loadMoreRows }) =>
  bindActionCreators({ loadMoreRows }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataGridContent);
export { DataGridContent };
