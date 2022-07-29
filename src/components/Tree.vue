<template>
  <div>
    <div id="mountNode"></div>
<!--    <div class="legend">-->
<!--      <el-rate-->
<!--          v-for="(i, index) in values"-->
<!--          v-model="values[index]"-->
<!--          disabled-->
<!--          size="small"-->
<!--          text-color="#ff9900"-->
<!--      />-->
<!--    </div>-->
  </div>
</template>

<script>
import G6 from "@antv/g6";
import {ElMessage} from "element-plus";

export default {
  name: "Tree",
  props: {
    treeData: Array
  },
  mounted() {
    this.initTree();
    //this.forceUpdate();//试图解决渲染时数据未更新的问题
  },
  data() {
    return {
      values: [1, 2, 3, 4, 5],
      treeGraph: ""
    }
  },
  methods: {
    // forceUpdate(){
    //   this.$nextTick(()=>{
    //     this.initTree();
    //     console.log(1)
    //   })
    // },
    initTree() {
      let that = this;
      const container = document.getElementById("mountNode");
      if (container.childNodes[0] !== undefined) {
        container.removeChild(container.childNodes[0]);
      }
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        G6.registerNode('tree-node', {
          draw(cfg, group) {
            // console.log(cfg)1
            const {title, depth, children, score} = cfg;
            const rootNode = depth === 0;
            const height = 40;
            const nodePaddingLeft = 20;
            const nodePaddingRight = 20;
            const textWidth = G6.Util.getTextSize(String(title), 12)[0];
            const nodeWidth = nodePaddingLeft + textWidth + nodePaddingRight;
            const keyShapeAttrs = {
              width: nodeWidth,
              height: height,
              x: 0,
              y: 0,
              radius: 10,
            };
            let color = "#409eff";
            // if (score >= 1 && score < 2) {
            // color = "#ee0000"
            // } else if (score >= 2 && score < 3) {
            // color = "#f37622"
            // } else if (score >= 3 && score < 4) {
            // color = "#fcdd4c"
            // color = "#99ff09"
            // } else if (score >= 4 && score <= 5) {
            // color = "#1ee360"
            // }
            let red = [238, 0, 0];
            let orange = [255, 165, 0];
            let yellow = [252, 221, 76];
            let lightGreen = [153, 216, 9];
            let green = [30, 227, 96];

            if (score >= 1 && score < 2) {
              color = that.colorCompute(red, orange, score - 1);
              // console.log(color)
            } else if (score >= 2 && score < 3) {
              color = that.colorCompute(orange, yellow, score - 2);
            } else if (score >= 3 && score < 4) {
              color = that.colorCompute(yellow, lightGreen, score - 3);
            } else if (score >= 4 && score <= 5) {
              color = that.colorCompute(lightGreen, green, score - 4);
            } else {
              color = "#409eff";
            }
            const keyShape = group.addShape('rect', {
              attrs: keyShapeAttrs,
              name: 'root-key-shape-rect-shape',
            });
            group.addShape('rect', {
              attrs: {
                x: 0,
                y: 0,
                radius: 10,
                width: nodeWidth,
                height,
                fill: color,
                cursor: 'pointer',
                opacity: rootNode ? 1 : 0.8,
              },
              name: 'main-shape'
            });
            if (rootNode) {
              group.addShape('text', {
                attrs: {
                  text: title,
                  x: 20,
                  y: height / 2,
                  textAlign: 'left',
                  textBaseline: 'middle',
                  fill: '#FFF',
                  cursor: 'pointer',
                }
              })
            } else {
              group.addShape('text', {
                attrs: {
                  text: title,
                  x: 20,
                  y: height / 2,
                  textAlign: 'left',
                  textBaseline: 'middle',
                  fill: '#000',
                  cursor: 'pointer',
                }
              })
            }
            return keyShape;
          },
          setState() {

          },
          update() {

          }
        });
        this.treeGraph = new G6.TreeGraph({
          defaultNode: {
            type: 'tree-node',
            anchorPoints: [
              [1, 0.5],
              [0, 0.5],
            ],
          },
          defaultEdge: {
            type: "cubic-horizontal",
            style: {
              stroke: "#A3B1BF",
            },
          },
          container: 'mountNode',
          width: width,
          height: height,
          modes: {
            default: [
              'drag-canvas',
              'zoom-canvas',
            ],
          },
          layout: {
            type: 'compactBox',
            direction: 'LR',
            getHGap: function getHGap() {
              return 50;
            },
          },
        });
        this.treeGraph.data(this.treeData);
        this.treeGraph.render();
        this.treeGraph.fitCenter();
        this.treeGraph.fitView();
        this.treeGraph.on('node:click', (e) => {
          if (e.item._cfg.model.score !== undefined)
            this.$emit('getReport', e.item._cfg.model.rid, e.item._cfg.model.score)
          //555513
          // ElMessage.success("rid:" + String(e.item._cfg.model.rid) + " title:" + String(e.item._cfg.model.title) + " score:" + String(e.item._cfg.model.score));

        })
        this.initSize(this.treeGraph)
      }
    },
    initSize(graph) {
      const container = document.getElementById("mountNode");
      setTimeout(() => {
        window.onresize = function () {
          graph.changeSize(container.clientWidth, container.clientHeight)
          graph.fitCenter();
          graph.fitView();
        }
      }, 20)
    },
    colorCompute(colorA, colorB, offset) {
      let res = []
      for (let i = 0; i < 3; i++) {
        res.push((colorB[i] - colorA[i]) * offset + colorA[i]);
      }
      return `rgb(${res[0]}, ${res[1]}, ${res[2]})`;
    }
  }
}
</script>

<style scoped>
#mountNode {
  width: 100%;
  height: calc(100vh - 250px);
}

.legend {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgb(238, 0, 0), rgb(255, 165, 0), rgb(252, 221, 76), rgb(153, 216, 9), rgb(30, 227, 96));
}
</style>