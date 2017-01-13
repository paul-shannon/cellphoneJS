//var $script = require("scriptjs");
//$script("//cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js", function() {
//  $('body').html('cy.min loaded!')
//});


var cytoscape = require('cytoscape');

var cyDiv = document.createElement('div')
cyDiv.id = "cyDiv";

var cy = $("#cyDiv");
var cyjs;

$(document).ready(function() {
  debugger;
  cy.cytoscape({
    elements: {
      nodes: [
        {data: {id: 'a', name: 'Node A', type: 'big' }},
        {data: {id: 'b', name: 'Node B', type: 'little'}},
        ],
     edges: [
       {data: {source: 'a', target: 'b'}},
       {data: {source: 'b', target: 'a'}}
       ]
     },
   ready: function(){
       cyjs = this;
       console.log("small cyjs network ready, with " + cyjs.nodes().length + " nodes.");
       } // ready
     }) // cytoscape()
});

module.exports = {
   cyDiv: cyDiv,
   cyjs: cyjs
   };

