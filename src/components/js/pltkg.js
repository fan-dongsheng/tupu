import * as d3 from 'd3';
import { lens } from './fisheye.js'

export function pltKg(datases) {
  console.log(datases);
  const margin = {
    top: 30,
    right: 150,
    bottom: 5,
    left: 5
  }
  const width = 700
  const height = 600
  var colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
    .domain(d3.range(datases.nodes.label))
    .range(['#ff9e6d', '#86cbff', '#c2e5a0', '#fff686', '#9e79db','#cccccc'])
// var colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
//     .domain(d3.range(datases.nodes.length))
//     .range(d3.scale.category20())
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink() // This force provides links between nodes
      .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
      .distance(150)
      .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-3000)) // This adds repulsion (if it's negative) between nodes.
    .force("center", d3.forceCenter(width / 2, height / 2)); // This force attracts nodes to the center of the svg area
  const container = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  const svg = container
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
  svg.append('defs').append('marker')
    .attr("id", 'arrowhead')
    .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr('refX', 23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 13)
    .attr('markerHeight', 13)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none');

  container.call(d3.zoom() // 自动创建事件侦听器
    .scaleExtent([0.1, 10]) // 缩放允许的级数
    .on("zoom", zoom)
  )

  function zoom() {
    svg.attr("transform", d3.event.transform);
    // translate变换矢量（使用二元组标识）scale当前尺度的数字
    // svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // 画布缩放与移动
    // svg.attr("transform", "scale(" + d3.event.scale + ")"); // 画布缩放
  }

  //create some data
  const dataset =datases
  // const dataset = {
  //   nodes: [
  //     { id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', runtime: 20 },
  //     { id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', runtime: 60 },
  //     { id: 3, name: 'CALC', label: 'Final Calc', group: 'Team C', runtime: 30 },
  //     { id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', runtime: 40 },
  //     { id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', runtime: 20 },
  //     { id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team C', runtime: 60 },
  //     { id: 7, name: 'GROW', label: 'Growth Model', group: 'Team C', runtime: 60 },
  //     { id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', runtime: 100 },
  //     { id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', runtime: 80 },
  //     { id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', runtime: 20 },
  //     { id: 11, name: 'REPT', label: 'Reporting', group: 'Team E', runtime: 240 },
  //     { id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', runtime: 30 },
  //     { id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team A', runtime: 40 }
  //   ],
  //   links: [
  //     { source: 1, target: 3, type: 'Next -->>' },
  //     { source: 6, target: 1, type: 'Next -->>' },
  //     { source: 7, target: 1, type: 'Next -->>' },
  //     { source: 9, target: 1, type: 'Next -->>' },
  //     { source: 2, target: 4, type: 'Next -->>' },
  //     { source: 2, target: 6, type: 'Next -->>' },
  //     { source: 2, target: 7, type: 'Next -->>' },
  //     { source: 2, target: 8, type: 'Next -->>' },
  //     { source: 2, target: 9, type: 'Next -->>' },
  //     { source: 10, target: 3, type: 'Next -->>' },
  //     { source: 3, target: 11, type: 'Next -->>' },
  //     { source: 8, target: 5, type: 'Go to ->>' },
  //     { source: 8, target: 11, type: 'Go to ->>' },
  //     { source: 6, target: 9, type: 'Go to ->>' },
  //     { source: 7, target: 9, type: 'Go to ->>' },
  //     { source: 8, target: 9, type: 'Go to ->>' },
  //     { source: 9, target: 11, type: 'Go to ->>' },
  //     { source: 12, target: 9, type: 'Go to ->>' },
  //     { source: 13, target: 11, type: 'Go to ->>' },
  //     { source: 13, target: 2, type: 'Go to ->>' },
  //     { source: 13, target: 4, type: 'This way>>' },
  //     { source: 13, target: 5, type: 'This way>>' },
  //     { source: 13, target: 8, type: 'This way>>' },
  //     { source: 13, target: 9, type: 'This way>>' },
  //     { source: 13, target: 10, type: 'This way>>' },
  //     { source: 4, target: 7, type: 'Next -->>' },
  //     { source: 4, target: 2, type: 'Next -->>' }
  //   ]
  // };

  // console.log("dataset is ...", dataset);

  var adjlist = [];

  dataset.links.forEach(function (d) {
    adjlist[d.source + "-" + d.target] = true;
    adjlist[d.target + "-" + d.source] = true;
  });

  function neigh(a, b) {
    return a == b || adjlist[a + "-" + b];
  }

  // Initialize the links
  const link = svg.selectAll(".links")
    .data(dataset.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke", "#aaa")
    .attr('marker-end', 'url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.


  //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
  //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
  link.append("title")
    .text(d => d.type);

  const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
    .data(dataset.links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function (d, i) {
      return 'edgepath' + i
    })
    .style("pointer-events", "none");

  const edgelabels = svg.selectAll(".edgelabel")
    .data(dataset.links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) {
      return 'edgelabel' + i
    })
    .attr('font-size', 12)
    .attr('fill', '#aaa');

  edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
    .attr('xlink:href', function (d, i) {
      return '#edgepath' + i
    })
    .style("text-anchor", "middle")
    // .attr("x", function (d) {
    //   return (d.source.x + d.target.x) / 2
    // })
    // .attr("y", function (d) {
    //   return (d.source.y + d.target.y) / 2
    // })
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(d => d.type);

  // Initialize the nodes
  const node = svg.selectAll(".nodes")
    .data(dataset.nodes)
    .enter()
    .append("g")
    .attr("class", "nodes")
    .call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
      .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
      .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
      //.on("end", dragended)     //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
    );
//圆环边线颜色
  var nodeCicles = node.append("circle")
    .attr("r", d => 20)//+ d.runtime/20 )
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", d => 30 / 10)  //.style("stroke-width", d => d.runtime / 10) 
    .style("fill", d => colorScale(d.label))
//球悬浮title
  node.append("title")
    .text(d => d.id + ": " + " - " + d.label + ", runtime:" + '30' + "min");

  var nodeText = node.append("text")
    .attr("dy", function (d) { return d.y; })
    .attr("dx", function (d) { return d.x+10; })
    .text(d => d.name);

  // node.append("text")
  //   .attr("dy", 12)
  //   .attr("dx", -8)
  //   .text(d => d.runtime);

  node.on("click", drawCircle)

  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation
    .nodes(dataset.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(dataset.links);


  // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
  function ticked() {
    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`)

    edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    d3.select("#eee").remove(); // 删除节点扇形
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  //the targeted node is released when the gesture ends
  //   function dragended(d) {
  //     if (!d3.event.active) simulation.alphaTarget(0);
  //     d.fx = null;
  //     d.fy = null;

  //     console.log("dataset after dragged is ...",dataset);
  //   }

  //drawing the legend
  const legend_g = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${width},${i * 20})`);

  legend_g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", colorScale);

  legend_g.append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text(d => d);

  // //drawing the second legend
  // const legend_g2 = svg.append("g")
  //   //.attr("transform", (d, i) => `translate(${width},${i * 20})`);
  //   .attr("transform", `translate(${width}, 120)`);

  // legend_g2.append("circle")
  //   .attr("r", 5)
  //   .attr("cx", 0)
  //   .attr("cy", 0)
  //   .style("stroke", "grey")
  //   .style("stroke-opacity", 0.3)
  //   .style("stroke-width", 15)
  //   .style("fill", "black")
  // legend_g2.append("text")
  //   .attr("x", 15)
  //   .attr("y", 0)
  //   .text("long runtime");

  // legend_g2.append("circle")
  //   .attr("r", 5)
  //   .attr("cx", 0)
  //   .attr("cy", 20)
  //   .style("stroke", "grey")
  //   .style("stroke-opacity", 0.3)
  //   .style("stroke-width", 2)
  //   .style("fill", "black")
  // legend_g2.append("text")
  //   .attr("x", 15)
  //   .attr("y", 20)
  //   .text("short runtime");
//圆环数据
  const nodeData = {
    "name": "TOPICS", "children": [{
      "name": "TopicA", "size": 6, "icon": "\ue621",
      // "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
    }, {
      "name": "TopicB", "icon": "\ue684",
      "children": [{ "name": "Sub B1", "icon": "看板", "size": 2 }, { "name": "Sub B2", "icon": "操作", "size": 2 }, {
        "name": "Sub B3", "icon": "减少", "size": 2
      }]
    }, {
      "name": "TopicC", "icon": "\ue6a0",
      "children": [{ "name": "Sub C1", "icon": "压缩", "size": 3 }, { "name": "Sub C2", "icon": "放大", "size": 3 }]
    }, {
      "name": "TopicD", "icon": "\ue62a",
      "children": [{ "name": "Sub D1", "icon": "搜索", "size": 3 }, { "name": "Sub D2", "icon": "增加", "size": 3 }]
    }, {
      "name": "TopicE", "icon": "\ue62c",
      "children": [{ "name": "Sub E1", "icon": "加载", "size": 3 }, { "name": "Sub E2", "icon": "扩展", "size": 3 }]
    }
    ]
  }
  //圆环入口
  function drawCircle(nd) {
    // Variables
    var width1 = 250;
    var height1 = 250;
    var radius = Math.min(width1, height1) / 2;
    // var color = d3.scaleOrdinal(d3.schemeCategory20b);

    // Create primary <g> element
    var g = svg.append('g')
      .attr("id", "eee")
      .attr('transform', 'translate(' + nd.x + ',' + nd.y + ')')




    // Data strucure
    var partition = d3.partition()
      .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(nodeData)
      .sum(function (d) { return d.size });

    // Size arcs
    partition(root);
    var arc = d3.arc()
      .startAngle(function (d) { return d.x0 })
      .endAngle(function (d) { return d.x1 })
      .innerRadius(function (d) { return d.y0 })
      .outerRadius(function (d) { return d.y1 });

    // Put it all together
    var path = g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr("display", function (d) {
        return d.depth == 1 ? null : "none";
      })
      .attr("d", arc)
      // .attr("fill-opacity", 0.8)
      .style("fill", function (d) {
        return d.depth == 1 ? "#F0F6FE" : "#45A5EF";
      })
      .attr("class", function (d) {
        return d.depth == 2 ? "hiddenUp" : null;
      })
      .style("cursor", "pointer")
      .on("mouseenter", function (d) {
        d3.select(this).style("fill", function (d) {
          return d.depth == 1 ? "#F0F6F0" : "#45A5B0";
        })
        const dd = d.children
        path
          .filter(d => dd === undefined ? false : dd.indexOf(d) > -1)
          .attr("display", null)
          .attr("class", "showUp")

        iconsLab.filter(d => dd === undefined ? false : dd.indexOf(d) > -1)
          .attr("display", null)
          .attr("class", "visUp")
      })
      .on("mouseleave", function (d) {
        d3.select(this).style("fill", function (d) {
          return d.depth == 1 ? "#F0F6FE" : "#45A5EF";
        })
      })
      .on("mouseover", function (d) {
        let showed = d3.selectAll(".showUp")
        if (!showed.empty()) {
          if (showed.datum().parent.children.indexOf(d) == -1 && d.data.name !== showed.datum().parent.data.name) {
            d3.selectAll(".showUp")
              .attr("display", "none")
              .attr("class", "hiddenUp")
            d3.selectAll(".visUp")
              .attr("display", "none")
              .attr("class", "hidUp")
          }
        }
      })

    path.on("mouseout", function (d) {
      var array = printPosition();
      var distance = Math.sqrt(Math.pow((nd.x - array[0]), 2) + Math.pow((nd.y - array[1]), 2));
      if (d.data.name == "TopicA") {
        if (distance > radius / 2) {
          d3.select("#eee").remove(); // 删除节点扇形
        }
      } else {
        if (distance > radius) {
          d3.select("#eee").remove(); // 删除节点扇形
        }
      }

    });

    path.on("click", function (d) {
      switch (d.data.name) {
        case "TopicA":
          console.log("您点击的是TopicA按钮");
          break;
        case "TopicB":
          console.log("您点击的是TopicB按钮");
          break;
        case "TopicC":
          console.log("您点击的是TopicC按钮");
          break;
        case "TopicD":
          console.log("您点击的是TopicD按钮");
          break;
        case "TopicE":
          console.log("您点击的是TopicE按钮");
          break;
        case "Sub B1":
          console.log("您点击的是Sub B1按钮");
          break;
        case "Sub B2":
          console.log("您点击的是Sub B2按钮");
          break;
        case "Sub B3":
          console.log("您点击的Sub B3按钮");
          break;
        case "Sub C1":
          console.log("您点击的是Sub C1按钮");
          break;
        case "Sub C2":
          console.log("您点击的是Sub C2按钮");
          break;
        case "Sub D1":
          console.log("您点击的是Sub D1按钮");
          break;
        case "Sub D2":
          console.log("您点击的是Sub D2按钮");
          break;
        case "Sub E1":
          console.log("您点击的是Sub E1按钮");
          break;
        case "Sub E2":
          console.log("您点击的是Sub E2按钮");
          break;
        default:
          console.log("您未点击有效按钮");
      }
    })

    const iconsLab = g.append("g")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      // .attr("fill-opacity", 0.3)
      .attr("transform", function (d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 90 : 90})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('class', d => d.depth > 0 ? (d.depth == 1 ? 'iconfont' : "hidUp") : null)
      .attr("display", d => d.depth > 0 ? (d.depth == 1 ? null : "none") : null)
      .attr('style', "color:#ff00ff;")
      .attr('font-size', '10px')
      .style("cursor", "pointer")
      .text(d => d.depth > 0 ? d.data.icon : null)

    iconsLab
      .on("mouseenter", function (d) {
        const dd = d
        path.filter(d => dd == d).style("fill", function (d) { return d.depth == 1 ? "#F0F6F0" : "#45A5B0"; })
      })
      .on("mouseleave", function (d) {
        const ddd = d
        path.filter(d => ddd == d)
          .style("fill", function (d) {
            return d.depth == 1 ? "#F0F6FE" : "#45A5EF";
          })
      })


    iconsLab.on("click", function (d) {
      switch (d.data.name) {
        case "TopicA":
          console.log("您点击的是TopicA按钮");
          break;
        case "TopicB":
          console.log("您点击的是TopicB按钮");
          break;
        case "TopicC":
          console.log("您点击的是TopicC按钮");
          break;
        case "TopicD":
          console.log("您点击的是TopicD按钮");
          break;
        case "TopicE":
          console.log("您点击的是TopicE按钮");
          break;
        case "Sub B1":
          console.log("您点击的是Sub B1按钮");
          break;
        case "Sub B2":
          console.log("您点击的是Sub B2按钮");
          break;
        case "Sub B3":
          console.log("您点击的Sub B3按钮");
          break;
        case "Sub C1":
          console.log("您点击的是Sub C1按钮");
          break;
        case "Sub C2":
          console.log("您点击的是Sub C2按钮");
          break;
        case "Sub D1":
          console.log("您点击的是Sub D1按钮");
          break;
        case "Sub D2":
          console.log("您点击的是Sub D2按钮");
          break;
        case "Sub E1":
          console.log("您点击的是Sub E1按钮");
          break;
        case "Sub E2":
          console.log("您点击的是Sub E2按钮");
          break;
        default:
          console.log("您未点击有效按钮");
      }
    })
  }

  //鼠标位置,获取画布坐标
  function printPosition() {
    var position = d3.mouse(svg.node());
    return position;
  }

  function focus(d) {
    var index = d3.select(d3.event.target).datum().id;
    node.style("opacity", function (o) {
      return neigh(index, o.id) ? 1 : 0.1;
    });
    edgelabels.attr("display", function (o) {
      return o.source.id == index || o.target.id == index ? "block" : "none";
    });
    link.style("opacity", function (o) {
      return o.source.id == index || o.target.id == index ? 1 : 0.1;
    });
  }

  function unfocus(d) {
    node.style("opacity", 1);
    edgelabels.attr("display", "block");
    link.style("opacity", 1);
  }

  function focusLink(d) {
    var ind = d3.select(d3.event.target).datum().id;

    var childLinkList = []
    var childNodeList = []
    var parentLinkList = []
    var parentNodeList = []
    var PnameList = []
    var sourceList = []
    var targetList = []
    dataset.links.forEach((val) => {
      sourceList.push(val.source.id);
      targetList.push(val.target.id)
    })

    function findChild(data, id) {
      data.forEach((item) => {
        if (item.source.id == id) {
          childLinkList.push(item.index)
          childNodeList.push(item.target.id)
          id = item.target.id
          findChild(data, id);
        }
      })
    }
    findChild(dataset.links, ind)

    function findParent(data, id) {
      data.forEach((item) => {
        if (item.target.id == id) {
          PnameList.push(item.source.name)
          parentLinkList.push(item.index)
          parentNodeList.push(item.source.id)
          id = item.source.id
          findParent(data, id);
        }
      })
    }
    findParent(dataset.links, ind)
    const nodeList = parentNodeList.concat(childNodeList);
    const linkList = parentLinkList.concat(childLinkList)
    node.style("opacity", function (o) {
      return nodeList.indexOf(o.id) > -1 || o.id == ind ? 1 : 0.1;
    });
    edgelabels.attr("display", function (o) {
      return linkList.indexOf(o.index) > -1 ? "block" : "none";
    });
    link.style("opacity", function (o) {
      return linkList.indexOf(o.index) > -1 ? 1 : 0.1;
    });
  }

  function unfocusLink(d) {
    node.style("opacity", 1);
    edgelabels.attr("display", "block");
    link.style("opacity", 1);
  }

  // node.on("mouseover", focus)
  //   .on("mouseout", unfocusLink)

//   var fisheye = lens().circular()
//     .radius(100)
//     .distortion(5);

// //鼠标进入
//   container.on("mousemove", function () {
//     fisheye.focus(d3.mouse(this));


//     nodeCicles.each(function (d) { d.fisheye = fisheye(d); });

//     nodeCicles
//       // .attr("transform", d => `translate(${d.fisheye.x - d.x},${d.fisheye.y - d.y})`)
//       .attr("cx", function (d) { return d.fisheye.x - d.x; })
//       .attr("cy", function (d) { return d.fisheye.y - d.y; })
//       .attr("r", function (d) { return d.fisheye.z * 20; });

//     nodeText
//       .attr("dx", function (d) { return d.fisheye.x - d.x; })
//       .attr("dy", function (d) { return d.fisheye.y - d.y; });

//     edgepaths.attr('d', d => 'M ' + d.source.fisheye.x + ' ' + d.source.fisheye.y + ' L ' + d.target.fisheye.x + ' ' + d.target.fisheye.y);

//     // edgelabels.attr("x", function (d) {
//     //   return (d.source.fisheye.x + d.target.fisheye.x-d.source.x-d.target.x) / 2
//     // })
//     //   .attr("y", function (d) {
//     //     return (d.source.fisheye.y + d.target.fisheye.y-d.source.y-d.target.y) / 2
//     //   })

//     link.attr("x1", function (d) { return d.source.fisheye.x; })
//       .attr("y1", function (d) { return d.source.fisheye.y; })
//       .attr("x2", function (d) { return d.target.fisheye.x; })
//       .attr("y2", function (d) { return d.target.fisheye.y; });
//   })
}
