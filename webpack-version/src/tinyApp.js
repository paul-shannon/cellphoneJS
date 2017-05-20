// tinyApp.js

var sfnButton = null;
var originalNetwork = null;
var phoneTreeVisibility = 0.0;
var cyjsVisibility = 0.98;

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

    setupMenus: function(cy){
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
          });

       helpButton = $("#helpButton");
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
          });

       sfnButton = $("#sfnButton");
       sfnButton.prop('disabled', true);
       sfnButton.click(function(){cy.nodes(":selected").outgoers().targets().select()});
       this.setupPhoneTreeOperations();
       }, // setupMenus

    setupPhoneTreeOperations: function(){
       var stepButton = $("#phoneTreeStepButton");
       var runButton = $("#phoneTreeRunButton");
       var clearButton = $("#phoneTreeClearButton");
       clearButton.click(this.resetPhoneTreeCounts);
       stepButton.click(this.stepPhoneTree);
       runButton.click(this.runPhoneTree);
       },

    resetPhoneTreeCounts: function(){
       console.log("resetPhoneTreeCounts")
       var nodeIDs = cy.nodes().map(function(node){return node.id()});
       for(n=0; n < nodeIDs.length; n++){
          var readoutString = "#phoneTreeReadout_" + nodeIDs[n];
          $(readoutString).val(0);
          } // for
       },

    stepPhoneTree: function(){
       console.log("stepPhoneTree")
       console.log("1 selected node? " + cy.nodes(":selected").length);
       var nextNodesToCall = cy.nodes(":selected").outgoers().targets()
       for(n=0; n < nextNodesToCall.length; n++){
          var node = nextNodesToCall[n];
          var id = node.id();
          var readoutString = "#phoneTreeReadout_" + id;
          var updatedCount = parseInt($(readoutString).val()) + 1;
          $(readoutString).val(updatedCount);
          node.select();
          } // for n
       },

    runPhoneTree: function(){
       console.log("runPhoneTree")
       console.log("1 selected node? " + cy.nodes(":selected").length);
       var nextNodesToCall = cy.nodes(":selected").outgoers().targets()

       },

    initialWindowConfiguration: function(){
       $("#phoneTreePanel").hide()
       },

    enableDisableMenusBasedOnSelectedNodeCount: function(cy){
       var selectedNodeCount = cy.nodes(":selected").length
        if(selectedNodeCount > 0){
          clearSelectionsButton.prop('disabled', false);
          sfnButton.prop("disabled", false);
          }
       switch(selectedNodeCount){
          case 0:
             window.singleSelectedNode = null;
             sfnButton.prop("disabled", true);
             break;
          case 1:
             window.singleSelectedNode = cy.nodes(":selected").map(function(obj){return obj});
             sfnButton.prop("disabled", false);
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

