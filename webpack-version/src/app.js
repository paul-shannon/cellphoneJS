// tinyApp.js -- renamed to app.js

var sfnButton = null;
var originalNetwork = null;
var phoneTreeVisibility = 0.0;
var cyjsVisibility = 0.98;
var phoneTreeNodesAlreadyContacted = [];
var phoneTreeNodesAlreadyVisited = [];
var phoneTreeStepCount = 0;
var callers = {};
module.exports = {

    init: function(network){
          // use a cheap trick to clone the network - make an
          // entirely distinct copy.
       originalNetwork = JSON.parse(JSON.stringify(network));
       console.log("hello fromm tinyApp.init");
       },

    handleWindowResize: function(){
        var outermostDivHeight = $("#outermostDiv").height();
        var menubarHeight = $("#menubarDiv").height();
        var newHeight = outermostDivHeight - (menubarHeight + 20);
        var mainDivWidth = $("#mainDiv").width();

        var cyDiv = $("#cyDiv");
        var phoneTreePanel = $("#phoneTreePanel");

        cyDiv.height(newHeight)
        cyDiv.width(mainDivWidth * cyjsVisibility)
        phoneTreePanel.width(mainDivWidth * phoneTreeVisibility);
        phoneTreePanel.height(newHeight);
        },

    selectShortestPath: function() {
       var selectedNodes = cy.nodes(":selected");
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
        //var functioningNodes = cy.nodes("[status!='knockedOut']")
        //var d = functioningNodes.dijkstra({root: rootNode, directed: true});
        var d = cy.elements(":visible").dijkstra({root: rootNode, directed: true});
        var path = d.pathTo(targetNode)
        var nodesInPath = path.nodes();
        nodesInPath.select()
        var max = nodesInPath.length - 1;
        for(var i=0; i < max; i++){
            nodesInPath[i].edgesTo(nodesInPath[i+1]).select();
           } // for i
        }, // selectShortestPath

    setupMenus: function(){
       knockoutButton = $("#knockoutButton");
       knockoutButton.prop('disabled', true);
       knockoutButton.click(function(){});

       restoreButton = $("#restoreButton");
       restoreButton.prop('disabled', true);
       restoreButton.click(function(){});

	phoneTreeButton = $("#phoneTreeButton");
       phoneTreeButton.prop('disabled', false);
        var obj = this;
       phoneTreeButton.click(function(){
         console.log("phone tree!");
           obj.togglePhoneTreePanel(obj);
         });

       shortestPathButton = $("#shortestPathButton");
       shortestPathButton.prop('disabled', false);
       shortestPathButton.click(this.selectShortestPath);

       resetGraphButton = $("#resetGraphButton");
       resetGraphButton.prop('disabled', false);
        resetGraphButton.click(function(){
          cy.add(originalNetwork.elements)
          cy.nodes().show()
          cy.edges().show();
          cy.nodes().unselect()
          cy.edges().unselect();
          cy.fit(50);
          });

       helpButton = $("#helpButton").hide();
       helpButton.click(function(){});

       fitButton = $("#fitButton");
       fitButton.click(function(){cy.fit(50)});

       fitSelectedButton = $("#fitSelectedButton");
       fitSelectedButton.prop('disabled', false);

       fitSelectedButton.click(function(){
         var selectedNodes = cy.filter('node:selected');
         if(selectedNodes.length > 0){
           cy.fit(selectedNodes, 50)
           }});

       clearSelectionsButton = $("#clearSelectionsButton");
       clearSelectionsButton.prop('disabled', true);
       clearSelectionsButton.click(function(){
          cy.nodes(":selected").unselect()
          cy.edges(":selected").unselect()
          //phoneTreeNodesAlreadyContacted = [];
          phoneTreeNodesAlreadyVisited = [];
          });

       sfnButton = $("#sfnButton");
       sfnButton.prop('disabled', true);
       sfnButton.click(function(){cy.nodes(":selected").outgoers().edges(":visible").targets().select()});
       this.setupPhoneTreeOperations();
       }, // setupMenus

    setupPhoneTreeOperations: function(){
       var stepButton = $("#phoneTreeStepButton");
       var runButton = $("#phoneTreeRunButton");
       var clearButton = $("#phoneTreeClearButton");
       var obj = this;
       clearButton.click(function(){obj.resetPhoneTree(obj)});
       stepButton.click(function() {obj.stepPhoneTree(obj)});
       // runButton.click(this.runPhoneTree);
       },

    initializePhoneTreeData: function(){
       phoneTreeStepCount = 0;
       phoneTreeNodesAlreadyVisited = [];
       callers = {};
       var nodeIDs = cy.nodes().map(function(x){return(x.id())})
       for(i=0; i < nodeIDs.length; i++){
          callers[nodeIDs[i]] = [];
          } // for i
       },

    resetPhoneTree: function(obj){
       console.log("resetPhoneTree")
       var nodeIDs = cy.nodes().map(function(node){return node.id()});
       cy.nodes().unselect();
       obj.initializePhoneTreeData();
       $("#phoneTreeStepCountReadout").val(0);
       for(n=0; n < nodeIDs.length; n++){
          var readoutString = "#phoneTreeReadout_" + nodeIDs[n];
          var readoutString = "#phoneTreeReadout_outgoing_" + nodeIDs[n];
          $(readoutString).val(0);
          readoutString = "#phoneTreeReadout_incoming_" + nodeIDs[n];
          $(readoutString).val(0);
          } // for
       },

    stepPhoneTree: function(obj){
       console.log("stepPhoneTree, cy: ")
       console.log(cy);
       var selectedNodes = cy.nodes(":selected");
       console.log("1 selected node? " + cy.nodes(":selected").length);
       if(selectedNodes.length == 0){
          return;
          }
      if(selectedNodes.length == 1) {
         //debugger;
         obj.initializePhoneTreeData();
         }
       console.log("--- about to make nonredundant phone calls from currently selected nodes, count: " + selectedNodes.length);
         // brute force: no check yet to see if we have called from any node before
       phoneTreeStepCount += 1;
       $("#phoneTreeStepCountReadout").val(phoneTreeStepCount);
       for(var n=0; n<selectedNodes.length; n++){
          var callingNode = selectedNodes[n];
          var callingNodeID = callingNode.id()
          var virginCaller = (phoneTreeNodesAlreadyVisited.indexOf(callingNodeID) < 0)
          if(virginCaller){
             phoneTreeNodesAlreadyVisited.push(callingNodeID);  // so it won't place outgoing calls again.
             var nextNodesToCall = callingNode.outgoers().edges(":visible").targets().filter(); // ":unselected");
             for(nOut=0; nOut < nextNodesToCall.length; nOut++){
                var nodeToCall = nextNodesToCall[nOut];
                var nodeToCallID = nodeToCall.id()
                  // is the candidate nodeToCall a node that previously called us?  then do not call
                console.log("---- proposed: " + callingNodeID + " wants to call " + nodeToCallID);
                //debugger;
                if(callers[callingNodeID].indexOf(nodeToCallID) >= 0){
                  console.log(callingNodeID + " already called by " + nodeToCallID + ": skipping");
                  continue;
                  }
                callers[nodeToCallID].push(callingNodeID);
                var readoutString = "#phoneTreeReadout_outgoing_" + callingNodeID;
                var updatedCount = parseInt($(readoutString).val()) + 1;
                $(readoutString).val(updatedCount);
                var readoutString = "#phoneTreeReadout_incoming_" + nodeToCallID;
                var updatedCount = parseInt($(readoutString).val()) + 1;
                $(readoutString).val(updatedCount);
                nodeToCall.select();
                console.log("  ** new call: " + callingNodeID + " -> " + nodeToCallID);
               } // for nOut
             } // if new out-calling node
          } // for n
       }, // stepPhoneTree

    runPhoneTree: function(){
       console.log("runPhoneTree")
       console.log("1 selected node? " + cy.nodes(":selected").length);
       var nextNodesToCall = cy.nodes(":selected").outgoers().targets()

       },

    initialWindowConfiguration: function(){
       $("#phoneTreePanel").hide();
       },

    enableDisableMenusBasedOnSelectedNodeCount: function(cy){
       var selectedNodeCount = cy.nodes(":selected").length
       console.log("tinyApp.enableDisable, selectedNodeCount: " + selectedNodeCount);
       if(selectedNodeCount > 0){
          clearSelectionsButton.prop('disabled', false);
          $("#phoneTreeStepButton").prop("disabled", false);
          sfnButton.prop("disabled", false);
          }
       switch(selectedNodeCount){
          case 0:
             window.singleSelectedNode = null;
             //$("#phoneTreeStepButton").prop("disabled", true);
             break;
          case 1:
             window.singleSelectedNode = cy.nodes(":selected").map(function(obj){return obj});
             sfnButton.prop("disabled", false);
             $("#phoneTreeStepButton").prop("disabled", false);
             break;
          case 2:
             // turn on the "shortest path" button
             break;
          default:  // > 2 nodes selected
             window.singleSelectedNode = null;
           } // switch on selectedNodeCount
       }, // enableDisableMenusBasedOnSelectedNodeCount

    togglePhoneTreePanel: function(obj) {
       var phoneTreePanelWidth = $("#phoneTreePanel").width()
       if(phoneTreePanelWidth < 5){
          $("#phoneTreePanel").show();
          phoneTreeVisibility = 0.30;
          cyjsVisibility = 0.68;
          }
       else{
         phoneTreeVisibility = 0.0;
         $("#phoneTreePanel").hide();
         cyjsVisibility = 0.98;
         }
      obj.handleWindowResize();
      setTimeout(function() {cy.fit(100);}, 500);
      } // togglePhoneTreePanel

} // module.exports

