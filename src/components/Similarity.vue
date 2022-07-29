<template>
  <div id="container" style="height: 500px"></div>
</template>

<script>
import G6 from "@antv/g6";
import {ElMessage} from "element-plus";

export default {
  name: "Similarity",
  props: {similarityData: Object},
  data() {
    return {}
  },
  mounted() {
    this.initImg()
  },
  methods: {
    initImg() {
      let container = document.getElementById('container')
      const width = container.scrollWidth;
      const height = container.scrollHeight
      if (container.childNodes[0] !== undefined) {
        container.removeChild(container.childNodes[0]);
      }
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitCenter: true,
        groupByTypes: false,
        modes: {
          default: ['drag-canvas', 'drag-combo'],
        },
        layout: {
          type: 'comboForce',
          nodeSpacing: (d) => 8,
          preventOverlap: true,
        },
        defaultCombo: {
          type: 'circle',
          style:{
            cursor: 'pointer',
          },
          labelCfg: {
            /* label's offset to the keyShape */
            // refY: 10,
            /* label's position, options: center, top, bottom, left, right */
            position: 'top',
            /* label's style */
            // style: {
            //   fontSize: 18,
            // },
          },
        },
        /* styles for different states, there are built-in styles for states: active, inactive, selected, highlight, disable */
        /* you can extend it or override it as you want */
        // comboStateStyles: {
        //   active: {
        //     fill: '#f00',
        //     opacity: 0.5
        //   },
        // },
      });

      graph.data(this.similarityData);
      graph.render();
      graph.changeSize(container.clientWidth, container.clientHeight)
      graph.fitCenter();
      graph.fitView();

      graph.on('combo:mouseenter', (evt) => {
        const {item} = evt;
        graph.setItemState(item, 'active', true);
      });

      graph.on('combo:mouseleave', (evt) => {
        const {item} = evt;
        graph.setItemState(item, 'active', false);
      });
      graph.on('combo:click', (evt) => {
        const {item} = evt;
        // graph.setItemState(item, 'selected', true);
        // ElMessage.success(item._cfg.model.label)
        this.$emit('getReport', item._cfg.model.id)
      });
      graph.on('canvas:click', (evt) => {
        graph.getCombos().forEach((combo) => {
          graph.clearItemStates(combo);
        });
      });
      setTimeout(() => {
        window.onresize = function () {
          graph.changeSize(container.clientWidth, container.clientHeight)
          graph.fitCenter();
          graph.fitView();
        }
      }, 20)
    }
  }
}
</script>

<style scoped>

</style>