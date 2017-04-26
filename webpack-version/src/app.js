//----------------------------------------------------------------------------------------------------
function handleWindowResize ()
{
   //console.log("--- entering handleWindowResize");
   //console.log("outermostDiv: " + outermostDiv.width());
   //console.log("cyDiv:      " + cyDiv.width());

   var newHeight = $(window).height() - (menubarDiv.height() + 20);
   //cyDiv.width(0.75 * outermostDiv.width());
   cyDiv.height(newHeight)

   //console.log("--- leaving handleWindowResize");
   //console.log("outermostDiv: " + outermostDiv.width());
   //console.log("cyDiv:      " + cyDiv.width());

} // handleWindowResize
//--------------------------------------------------------------------------------
$(document).ready(function(){
   console.log("document ready");
   $(window).resize(handleWindowResize);
   cyDiv = $("#cyDiv");
   var cytoscape = require('cytoscape');
   var network = require("../data/cellphoneModel.json")
   var vizmap  = require("../data/networkStyle.json")
   var cy = cytoscape({container: $("#cyDiv"),
                    elements: network.elements,
                    layout: {name: "preset", fit: true},
                    style: vizmap});
   window.cy = cy;


   outermostDiv = $("#outermostDiv");
   menubarDiv = $("#menubarDiv");
   handleWindowResize();
   var cy = cytoscape({
      container: cyDiv,
      elements: network.elements,
      style: vizmap[0].style,  // the first style is the one we want
      showOverlay: false,
      minZoom: 0.1,
      maxZoom: 4.0,
      layout: {
         name: 'preset',
         fit: true
         },
      ready: function(){
        cyjs = this;
        cyjs.on("select", function(event){
           if(cyjs.nodes(":selected").length == 1){
             firstSelectedNode = event.cyTarget.id();
             }
           enableDisableMenusBasedOnSelectedNodeCount();
           });
        cyjs.on("unselect", function(){
           enableDisableMenusBasedOnSelectedNodeCount();
           });
        console.log("small cyjs network ready, with " + cyjs.nodes().length + " nodes.");
        cyjs.fit(50);
        } // ready
   }); // cytoscape()

   setupMenus();
   handleWindowResize();

}); // document ready
//----------------------------------------------------------------------------------------------------
function enableDisableMenusBasedOnSelectedNodeCount()
{
   var selectedNodeCount = cyjs.nodes(":selected").length
    if(selectedNodeCount > 0){
      clearSelectionsButton.prop('disabled', false);
      }

   switch(selectedNodeCount){
      case 0:
       window.singleSelectedNode = null;
       break;
      case 1:
         window.singleSelectedNode = cyjs.nodes(":selected").map(function(obj){return obj});
         break;
      case 2:
         // turn on the "shortest path" button
         break;
      default:  // > 2 nodes selected
         window.singleSelectedNode = null;
       } // switch on selectedNodeCount

} // enableDisableMenusBasedOnSelectedNodeCount
//----------------------------------------------------------------------------------------------------
function selectShortestPath()
{
  var selectedNodes = cyjs.nodes(":selected");
  if(selectedNodes.length != 2){
     return;
     }

   var selectedNodesIDs = selectedNodes.map(function(obj){return obj.id()});
   var rootNode = window.singleSelectedNode;
   var rootNodeID = rootNode[0].id();
   var rootNodeIndex = selectedNodesIDs.indexOf(rootNodeID);
   var targetNodeIndex = 1;
   if(rootNodeIndex == 1){
      targetNodeIndex = 0;  // just two possibilities, 0 or 1
      }
   var targetNode = selectedNodes[targetNodeIndex]
   var d = cyjs.elements().dijkstra({root: rootNode, directed: true});
   var path = d.pathTo(targetNode)
   var nodesInPath = path.nodes();
   nodesInPath.select()
   var max = nodesInPath.length - 1;
   for(var i=0; i < max; i++){
       nodesInPath[i].edgesTo(nodesInPath[i+1]).select();
      } // for i

} // selectShortestPath
//----------------------------------------------------------------------------------------------------
function setupMenus()
{
    knockoutButton = $("#knockoutButton");
    knockoutButton.prop('disabled', true);
    knockoutButton.click(function(){});

    restoreButton = $("#restoreButton");
    restoreButton.prop('disabled', true);
    restoreButton.click(function(){});

    phoneTreeButton = $("#phoneTreeButton");
    phoneTreeButton.prop('disabled', true);
    phoneTreeButton.click(function(){});

    shortestPathButton = $("#shortestPathButton");
    shortestPathButton.prop('disabled', false);
    shortestPathButton.click(selectShortestPath);

    resetGraphButton = $("#resetGraphButton");
    resetGraphButton.prop('disabled', true);
    resetGraphButton.click(function(){});

    helpButton = $("#helpButton");
    helpButton.click(function(){});

    fitButton = $("#fitButton");
    fitButton.click(function(){cyjs.fit(50)});

    fitSelectedButton = $("#fitSelectedButton");
    fitSelectedButton.prop('disabled', false);

    fitSelectedButton.click(function(){
      var selectedNodes = cyjs.filter('node:selected');
      if(selectedNodes.length > 0){
        cyjs.fit(selectedNodes, 50)
        }});

    clearSelectionsButton = $("#clearSelectionsButton");
    clearSelectionsButton.prop('disabled', true);
    clearSelectionsButton.click(function(){
       cyjs.nodes(":selected").unselect()
       cyjs.edges(":selected").unselect()
       });

    sfnButton = $("#sfnButton");
    sfnButton.prop('disabled', false);
    sfnButton.click(function(){cyjs.nodes(":selected").outgoers().targets().select()});

} // setupMenus
//----------------------------------------------------------------------------------------------------
