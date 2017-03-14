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
   outermostDiv = $("#outermostDiv");
   menubarDiv = $("#menubarDiv");
   handleWindowResize();
   cyDiv.cytoscape({
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
        cyjs.on("select", function(){
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
    switch(selectedNodeCount){
       case 0:
         break;
       case 1:
         break;
       case 2:
          break;
       default:  // > 2 nodes selected
          
       } // switch on selectedNodeCount

} // enableDisableMenusBasedOnSelectedNodeCount
//----------------------------------------------------------------------------------------------------
function selectShortestPath()
{
  var selectedNodes = cyjs.nodes(":selected");
  if(selectedNodes.length == 2){
     var d = cyjs.elements().dijkstra(selectedNodes[0])
     var path = d.pathTo(selectedNodes[1]);
     var nodesInPath = path.nodes();
     nodesInPath.select()
     for(var i=0; i < nodesInPath.length; i++){
        nodesInPath[i].edgesWith(nodesInPath).select()
        } // for i
     } // if
     

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
    clearSelectionsButton.click(function(){cyjs.filter("node:selected").unselect()});

    sfnButton = $("#sfnButton");
    sfnButton.prop('disabled', false);
    sfnButton.click(function(){cyjs.nodes(':selected').neighborhood().nodes().select()});

} // setupMenus
//----------------------------------------------------------------------------------------------------
