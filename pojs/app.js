//----------------------------------------------------------------------------------------------------
function handleWindowResize ()
{
   console.log("handleWindowResize");
   
   menubarDiv.width(0.98 * $(window).width());
   cyDiv.width(0.98 * $(window).width());
   var newHeight = $(window).height() - (menubarDiv.height() + 20);
   cyDiv.height(newHeight)

} // handleWindowResize
//--------------------------------------------------------------------------------
$(document).ready(function() {
   console.log("document ready");
   $(window).resize(handleWindowResize);
   menubarDiv = $("#menubarDiv");
   cyDiv = $("#cyDiv");
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
     console.log("small cyjs network ready, with " + cyjs.nodes().length + " nodes.");
     cyjs.fit();
     } // ready
   }) // cytoscape()
   handleWindowResize();
}); // document ready
//----------------------------------------------------------------------------------------------------
