import css from './css/style.css';
var cytoscape = require('cytoscape');
$("#cyDiv").height(1000);
var bootstrapLoader = require('bootstrap-loader');
var network = require("./data/cellphoneModel.json")
var vizmap  = require("./data/networkStyle.json")
var app = require("./app.js")
var menus = require("./menus.js")
menus.init();
var firstSelectedNode = null;

var cy = cytoscape({container: $("#cyDiv"),
                    elements: network.elements,
                    layout: {name: "preset", fit: true},
                    style: vizmap,
                    ready: function(){
                      cy = this;
                      cy.on("select", function(event){
                         if(cy.nodes(":selected").length == 1){
                            firstSelectedNode = event.target.id();
                            }
                         app.enableDisableMenusBasedOnSelectedNodeCount(cy);
                         });
                     cy.on("unselect", function(){
                       app.enableDisableMenusBasedOnSelectedNodeCount(cy);
                       });
                    console.log("small cy network ready, with " + cy.nodes().length + " nodes.");
                    setTimeout(function(){cy.fit(100);}, 250)
                   } // ready
               }); // cytoscape ctor

app.init(network)
$(window).resize(app.handleWindowResize);
app.handleWindowResize();
app.setupMenus();
app.initialWindowConfiguration();

window.cy = cy;


