import React, { Component } from "react";
import { Button, Card, List, Tooltip } from "antd";
import { observer } from "mobx-react";

import { CopyOutlined, WindowsOutlined } from "@ant-design/icons";

import Utils from "../../utils";
import styles from "../Completions/Completions.module.scss";

const Prediction = observer(({ item, store }) => {
  return (
    <List.Item
      key={item.id}
      className={item.selected ? `${styles.completion} ${styles.completion_selected}` : styles.completion}
      onClick={ev => {
        !item.selected && store.completionStore.selectPrediction(item.id);
      }}
    >
      <div className={styles.itembtns}>
        <div>
          <div className={styles.title}>{item.createdBy ? `Model (${item.createdBy})` : null}</div>
          Created
          <i>{item.createdAgo ? ` ${item.createdAgo} ago` : ` ${Utils.UDate.prettyDate(item.createdDate)}`}</i>
        </div>
        <div className={styles.buttons}>
          {item.selected && (
            <Tooltip placement="topLeft" title="Add a new completion based on this prediction">
              <Button
                size="small"
                onClick={ev => {
                  ev.preventDefault();

                  const cs = store.completionStore;
                  const p = cs.selected;
                  const c = cs.addCompletionFromPrediction(p);

                  // this is here because otherwise React doesn't re-render the change in the tree
                  window.setTimeout(function() {
                    store.completionStore.selectCompletion(c.id);
                  }, 50);
                }}
              >
                <CopyOutlined />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </List.Item>
  );
});

class Predictions extends Component {
  render() {
    const { store } = this.props;
    const { predictions } = store.completionStore;

    let title = (
      <div className={styles.title + " " + styles.titlespace}>
        <h3>Predictions</h3>
        {/* @todo fix View All mode */}
        {store.completionStore.predictions.length > 0 && false && (
          <Tooltip placement="topLeft" title="View all predictions">
            <Button
              size="small"
              type={store.completionStore.viewingAllPredictions ? "primary" : ""}
              onClick={ev => {
                ev.preventDefault();
                store.completionStore.toggleViewingAllPredictions();
              }}
            >
              <WindowsOutlined />
            </Button>
          </Tooltip>
        )}
      </div>
    );

    return (
      <Card title={title} size="small" bodyStyle={{ padding: "0" }}>
        <List>
          {predictions && predictions.length ? (
            predictions.map(p => <Prediction key={p.id} item={p} store={store} />)
          ) : (
            <List.Item>
              <div style={{ padding: "0 12px" }}>No predictions</div>
            </List.Item>
          )}
        </List>
      </Card>
    );
  }
}

export default observer(Predictions);
