import React from 'react';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { Grid } from 'react-virtualized';
import Draggable from 'react-draggable';

import styles from './ScrollSync.module.css';

class DataGridHeader extends React.Component {
  headerRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.columnWidths !== prevProps.columnWidths) {
      this.headerRef.current.recomputeGridSize();
    }
  }

  columnWidth = ({ index }) => {
    const { columns, columnWidths, totalWidth } = this.props;
    const column = columns[index].id;
    return columnWidths[column] * totalWidth;
  };

  renderHeaderCell = ({ columnIndex, key, style }) => {
    const { columns, onResizeColumn } = this.props;
    return (
      <div className={styles.headerCell} key={key} style={style}>
        <div>{`${columns[columnIndex].label}`}</div>
        <DraggableGridHeader
          columnIndex={columnIndex}
          onResizeColumn={onResizeColumn}
          columns={columns}
        />
      </div>
    );
  };

  render() {
    const {
      columnCount,
      rowHeight,
      overscanColumnCount,
      scrollLeft,
      width
    } = this.props;

    return (
      <div
        style={{
          height: rowHeight,
          width: width - scrollbarSize()
        }}>
        <Grid
          className={styles.HeaderGrid}
          columnWidth={this.columnWidth}
          columnCount={columnCount}
          height={rowHeight}
          overscanColumnCount={overscanColumnCount}
          cellRenderer={this.renderHeaderCell}
          rowHeight={rowHeight}
          rowCount={1}
          scrollLeft={scrollLeft}
          width={width - scrollbarSize()}
          ref={this.headerRef}
        />
      </div>
    );
  }
}

const position = { x: 0 };
class DraggableGridHeader extends React.Component {
  onResizeColumn = (_, { deltaX }) => {
    const { columnIndex, onResizeColumn } = this.props;
    onResizeColumn({ columnIndex, deltaX });
  };

  render() {
    const { columns, columnIndex } = this.props;
    if (columns.length - 1 === columnIndex) {
      // skip last element
      return null;
    }

    return (
      <Draggable
        axis="x"
        defaultClassName={styles.DragHandle}
        defaultClassNameDragging={styles.DragHandleActive}
        onDrag={this.onResizeColumn}
        position={position}>
        <span className={styles.DragHandleIcon}>⋮</span>
      </Draggable>
    );
  }
}

export default DataGridHeader;
export { DraggableGridHeader };
