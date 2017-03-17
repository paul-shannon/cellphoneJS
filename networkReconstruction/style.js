vizmap = [

   {selector: "node", css: {
      "shape": "ellipse",
      "text-valign":"center",
      "text-halign":"center",
      "content": "data(label)",
      "border-width": "3px",
      "background-color": "#FFFFFF",
      "border-color":"black",
       "width": "80px",
      "height": "80px",
      "font-size":"24px"}},

   {selector: 'node[carrier="ATT"]', css: {
       "border-color": "red",
       }},

   {selector: 'node[carrier="CellularOne"]', css: {
       "border-color": "orange",
       }},

   {selector: 'node[carrier="Nextel"]', css: {
       "border-color": "Green"
       }},

   {selector: 'node[carrier="Sprint"]', css: {
       "border-color": "purple"
       }},

   {selector: 'node[carrier="US Cellular"]', css: {
       "border-color": "magenta"
       }},

   {selector: 'node[carrier="Verizon Wireless"]', css: {
       "border-color": "blue"
       }},

   {selector:"node:selected", css: {
       "text-valign":"center",
       "text-halign":"center",
       "border-color": "black",
       "content": "data(id)",
       "border-width": "3px",
       "overlay-opacity": 0.2,
       "overlay-color": "gray"
       }},


   {selector:"edge", css: {
       'line-color': "rgb(50,50,50)",
       'target-arrow-color': 'rgb(50,50,50)',
       'target-arrow-shape': 'triangle',
       "width": "1px",
       'curve-style': 'bezier',
       'haystack-radius': 0.1
       }},

    {"selector": "edge:selected", css: {
       "overlay-opacity": 0.2,
       "overlay-color": "gray",
       "width": "2px",
       }},

   ];
