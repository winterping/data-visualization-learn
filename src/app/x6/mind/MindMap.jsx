"use client";
import React, { useEffect, useRef, useState } from "react";
import { Graph, Path } from "@antv/x6";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { Selection } from "@antv/x6-plugin-selection";
import Hierarchy from "@antv/hierarchy";
import styles from "./index.module.css";
import "./global.css";
import { Transform } from "@antv/x6-plugin-transform";
import { Button, Flex } from "antd";
import { History } from "@antv/x6-plugin-history";
import test_data from "./data.json";

//中心节点
Graph.registerNode(
  "topic",
  {
    inherit: "rect",
    width: 100,
    height: 40,
    markup: [
      // 指定了渲染节点/边时使用的 SVG/HTML 片段
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "image",
        selector: "img1",
      },
      {
        tagName: "image",
        selector: "img2",
      },
      {
        tagName: "text",
        selector: "label",
      },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: "#5178C7",
        fill: "#5178C7",
        strokeWidth: 1,
      },
      img1: {
        ref: "body",
        refX: "100%",
        refY: "50%",
        refY2: -8,
        width: 18,
        height: 18,
        "xlink:href":
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ",
        event: "add:topic:right",
        class: "topic-image",
      },
      img2: {
        ref: "body",
        refX: "0%",
        refY: "50%",
        refX2: "-18",
        refY2: -8,
        width: 18,
        height: 18,
        "xlink:href":
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ",
        event: "add:topic:left",
        class: "topic-image",
      },
      label: {
        fontSize: 14,
        fill: "#ffffff",
      },
    },
    tools: [
      {
        name: "node-editor",
        args: {
          attrs: {
            backgroundColor: "#EFF4FF",
          },
        },
      },
    ],
  },
  true
);

//子节点
Graph.registerNode(
  "topic-child",
  {
    inherit: "rect",
    width: 100,
    height: 40,
    markup: [
      // 指定了渲染节点/边时使用的 SVG/HTML 片段
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "image",
        selector: "img",
      },
      {
        tagName: "text",
        selector: "label",
      },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: "#5F95FF",
        fill: "#EFF4FF",
        strokeWidth: 1,
      },
      img: {
        ref: "body",
        // refX: "100%",
        refY: "50%",
        refY2: -8,
        width: 18,
        height: 18,
        "xlink:href":
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ",
        event: "add:topic:right",
        class: "topic-image",
      },
      label: {
        fontSize: 14,
        fill: "#262626",
      },
    },
    tools: [
      {
        name: "node-editor",
        args: {
          attrs: {
            backgroundColor: "#EFF4FF",
          },
        },
      },
    ],
  },
  true
);

// 连接器
Graph.registerConnector(
  "mindmap",
  (sourcePoint, targetPoint, routerPoints, options) => {
    const midX = sourcePoint.x + 10;
    const midY = sourcePoint.y;
    const ctrX = (targetPoint.x - midX) / 5 + midX;
    const ctrY = targetPoint.y;
    const pathData = `
       M ${sourcePoint.x} ${sourcePoint.y}
       L ${midX} ${midY}
       Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
      `;
    return options.raw ? Path.parse(pathData) : pathData;
  },
  true
);

// 边
Graph.registerEdge(
  "mindmap-edge",
  {
    inherit: "edge",
    connector: {
      name: "mindmap",
    },
    attrs: {
      line: {
        targetMarker: "",
        stroke: "#A2B1C3",
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
  true
);

//初始节点
const data = {
  id: "center",
  type: "topic",
  label: "中心主题",
  width: 160,
  height: 50,
  children: [
    {
      id: "1-1",
      type: "topic-child",
      label: "分支主题1",
      width: 100,
      height: 40,
      direction: "left",
      //   children: [
      //     {
      //       id: "1-1-1",
      //       type: "topic-child",
      //       label: "子主题1",
      //       width: 60,
      //       height: 30,
      //     },
      //   ],
    },
    {
      id: "1-2",
      type: "topic-child",
      label: "分支主题2",
      width: 100,
      height: 40,
      direction: "right",
    },
  ],
};

export default function Mind() {
  const refContainer = useRef(null);
  const graph = useRef(null);
  const [resizingEnabled, setResizingEnabled] = useState(true); //控制节点是否可以进行拉伸
  const [canRedo, setCanRedo] = useState(false); //是否可恢复
  const [canUndo, setCanUndo] = useState(false); //是否可恢复

  useEffect(() => {
    graph.current = new Graph({
      container: refContainer.current,
      connecting: {
        //通过配置 connecting 可以实现丰富的连线交互。
        connectionPoint: "anchor",
      },
      mousewheel: {
        //设置画布是否缩放
        enabled: true,
      },
      panning: true, //设置画布是否可以平移
    });
    graph.current.use(new Selection());
    graph.current.use(new Keyboard());
    graph.current.use(
      new Transform({
        resizing: resizingEnabled,
        // rotating: true,
      })
    );
    graph.current.use(
      new History({
        enabled: true,
      })
    );
    init();

    graph.current.on("history:change", () => {
      setCanUndo(graph.current.canUndo());
      setCanRedo(graph.current.canRedo());
    });
    graph.current.on("node:mouseenter", () => {});
    graph.current.on("node:mouseleave", () => {});
    graph.current.on("node:click", () => {
      setResizingEnabled(true);
    });

    //自定义节点的时候给添加图标设置了event事件名称，这边进通过名称进行关联
    graph.current.on("add:topic:left", (event) => {
      addNewNode(event, "left");
    });

    graph.current.on("add:topic:right", (event) => {
      addNewNode(event, "right");
    });

    //绑定删除键的监听事件
    graph.current.bindKey(["backspace", "delete"], () => {
      const selectedNodes = graph.current
        .getSelectedCells()
        .filter((item) => item.isNode());
      if (selectedNodes.length) {
        const { id } = selectedNodes[0];
        if (id !== "center") {
          const allNode = getAllDescendants(id);
          allNode.forEach((data) => {
            graph.current.removeNode(data);
          });
        }
      }
    });

    return () => {
      if (graph.current) {
        graph.current.dispose();
      }
    };
  }, []);

  // 获取某个节点的所有子节点
  const getAllDescendants = (nodeId) => {
    const visited = new Set();
    const descendants = new Set();

    const traverse = (currentNodeId) => {
      if (visited.has(currentNodeId)) {
        return;
      }

      visited.add(currentNodeId);
      const currentNode = graph.current.getCellById(currentNodeId);
      if (!currentNode) {
        return;
      }

      //getConnectedEdges方法获取与节点/边相连接的边。
      const edges = graph.current.getConnectedEdges(currentNode,{});
      edges.forEach((edge) => {
        const target = edge.getTargetCell();
        if (target && !descendants.has(target.id)) {
          descendants.add(target.id);
          traverse(target.id);
        }
      });
    };

    traverse(nodeId);

    return Array.from(descendants);
  };

  //添加新节点
  const addNewNode = (event, direction) => {
    // console.log("addd", event.node);
    event.e.stopPropagation(); //阻止事件冒泡防止添加的时候出现节点的拉伸功能
    setResizingEnabled(false);
    const cur_node = event.node;
    const cur_node_pos = cur_node.position();
    const { id } = cur_node;
    const nodes = graph.current.getNodes(); //返回画布中所有节点和边的数量
    const edges = graph.current.getEdges(); //返回画布中所有节点。

    /**
     * 因为要在原有的基础上添加新的节点，左右两边添加节点的位置不一样，目前想到的方式是获取所有的子节点，
     * 判断是往哪个方向添加节点，先找到最远的那个子节点位置，然后在最远的那个下边添加新的节点。
     */
    const childNodes = edges
      .filter((edge) => edge.getSourceCellId() === id)
      .map((edge) => edge.getTargetCell());
    let p_x = -Infinity;
    let p_y = -Infinity;
    childNodes.forEach((node) => {
      const { x, y } = node.position();
      // console.log("x, y ", x, y);
      if (direction === "left" && x < 0) {
        p_x = Math.min(p_x, x);
        p_y = Math.max(p_y, y);
      } else if (direction === "right" && x > 0) {
        p_x = Math.max(p_x, x);
        p_y = Math.max(p_y, y);
      }
    });
    // console.log("位置", p_x, p_y);
    if (event.cell.isNode()) {
      const newNodeId = `new-${Date.now()}`;
      const init_x =
        direction === "left" ? cur_node_pos.x - 150 : cur_node_pos.x + 150;

      addOneNode({
        id: newNodeId,
        label: "输入文本",
        children: [],
        x: p_x === -Infinity ? init_x : p_x, // 设置新节点的位置
        y: p_y === -Infinity ? cur_node_pos.y + 5 : p_y + 60,
        type: "topic-child",
        direction,
      });

      addOneEdge(event.cell, newNodeId, direction);
    }
  };

  const addOneNode = (data) => {
    const { type, direction } = data;
    return graph.current.addNode({
      ...data,
      shape: type === "topic-child" ? "topic-child" : "topic",
      attrs:
        type === "topic-child"
          ? {
              img: {
                refX: direction === "left" ? "0%" : "100%",
                event:
                  direction === "left" ? "add:topic:left" : "add:topic:right",
                refX2: direction === "left" ? -18 : 0,
              },
            }
          : {},
    });
  };
  // 添加新边
  const addOneEdge = (source_id, target_id, direction) => {
    return graph.current.addEdge({
      shape: "mindmap-edge",
      source: {
        cell: source_id,
        anchor: {
          name: direction,
          args: direction === "left" ? {} : { dx: -16 },
        },
      },
      target: {
        cell: target_id,
        anchor: {
          name: direction === "left" ? "right" : "left",
        },
      },
    });
  };

  //初始化数据，生成思维导图（Mind Map）类型的布局。
  const init = () => {
    const result = Hierarchy.mindmap(data, {
      direction: "H", //水平布局
      getHeight(d) {
        return d.height;
      },
      getWidth(d) {
        return d.width;
      },
      getHGap() {
        //获取节点水平间距的函数
        return 40;
      },
      getVGap() {
        //获取节点垂直间距的函数
        return 20;
      },
      getSide: (e) => {
        //  子节点在父节点的左边还是右边
        return e.data.direction || "right";
      },
    });
    // console.log("result", result);
    const cells = [];

    const traverse = (hierarchyItem) => {
      if (hierarchyItem) {
        const { data, children, x, y } = hierarchyItem;
        // console.log("data", data);
        const node = addOneNode({
          ...data,
          x,
          y,
        });
        cells.push(node);
        if (children) {
          children.forEach((item) => {
            const { id, data } = item;
            const edge = addOneEdge(hierarchyItem.id, id, data.direction);
            cells.push(edge);
            traverse(item);
          });
        }
      }
    };

    traverse(result);
    graph.current.resetCells(cells); //resetCells方法用于清空画布并添加用指定的节点/边。
    graph.current.centerContent(); // 将画布中元素居中展示
  };

  //撤销某操作
  const onUndo = () => {
    graph.current.undo();
  };

  //恢复某操作
  const onRedo = () => {
    graph.current.redo();
  };

  //导出
  const onExport = () => {
    const data = graph.current.toJSON();
    console.log("data", data);
  };

  //导入
  const onImport = () => {
    graph.current.clearCells();
    graph.current.fromJSON(test_data);
    graph.current.centerContent();
  };

  return (
    <div className="w-full h-full relative">
      <div className={styles.container} ref={refContainer}></div>
      <div className={styles.operate_container}>
        <Flex gap="small">
          <Button onClick={onUndo} disabled={!canUndo}>
            撤销
          </Button>
          <Button onClick={onRedo} disabled={!canRedo}>
            恢复
          </Button>
          <Button onClick={onExport}>导出数据</Button>
          <Button onClick={onImport}>导入一份数据</Button>
        </Flex>
      </div>
    </div>
  );
}
