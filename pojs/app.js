//----------------------------------------------------------------------------------------------------
function handleWindowResize ()
{
   console.log("handleWindowResize");
   
   outermostDiv.width(0.98 * $(window).width());
   menubarDiv.width(outermostDiv.width());
   mainDiv.width(outermostDiv.width());

   controlsDiv.width = 0.25 * outermostDiv.width()
   controlsDiv.height(0.98 * $(window).height());
   cyDiv.width(0.75 * mainDiv.width())

   var newHeight = $(window).height() - (menubarDiv.height() + 20);
   cyDiv.height(newHeight)

} // handleWindowResize
//--------------------------------------------------------------------------------
$(document).ready(function() {
   console.log("document ready");
   $(window).resize(handleWindowResize);
   mainDiv = $("#mainDiv");
   controlsDiv = $("#controlsDiv");
   outermostDiv = $("#outermostDiv);
   menubarDiv = $("#menubarDiv");
   $('.dropdown-submenu a.test').on("click", function(e){
     $(this).next('ul').toggle();
     e.stopPropagation();
     e.preventDefault();
     });
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
