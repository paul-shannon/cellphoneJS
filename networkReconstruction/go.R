library(RCyjs)
library(XML)
text <- scan("../submenu-simple/network.json", what=character(0), sep="\n", quiet=TRUE)
text[1] <- "{"   # remove "network ="
text[length(text)] <- "]}}"
x <- fromJSON(text)
tbl.nodes <- cbind(x$elements$nodes$data, x$elements$nodes$position)[, c("id", "name", "x", "y")]
tbl.edges <- x$elements$edges$data[, c("source", "target", "interaction")]
tbl.edges$a <- tbl.nodes[match(tbl.edges$source, tbl.nodes$id), "name"]
tbl.edges$b <- tbl.nodes[match(tbl.edges$target, tbl.nodes$id), "name"]
tbl.edges <- tbl.edges[, c("a", "b", "interaction")]
colnames(tbl.edges) <- c("a", "b", "edgeType")
stopifnot(all(tbl.edges$edgeType == "can call"))
tbl.edges$edgeType <- "oneWay"

edge.signature <- unlist(lapply(1:nrow(tbl.edges), function(i){
    nodes <- sort(c(tbl.edges$a[i], tbl.edges$b[i])); sprintf("%s:%s", nodes[1], nodes[2])}))
tbl.edges$signature <- edge.signature

  # duplicated signatures indicate nodes with reciprocal 'canCall' relationships
  # since the graphNEL supports only single edges between nodes, we must create
  # two graphs, send them sequentially to R

tbl.edges$reciprocal <- FALSE
dups.indices <- which(duplicated(tbl.edges$signature))
dup.signatures <- sort(unique(tbl.edges$signature[dups.indices]))
dups.all <- which(tbl.edges$signature %in% dup.signatures)
tbl.edges$reciprocal[dups.all] <- TRUE
as.data.frame(table(tbl.edges$reciprocal))   # 47 FALSE, 46 TRUE

tbl.nodes <- tbl.nodes[, -1]

tbl.noa <- xmlToDataFrame( xmlParse("nodeAttributes.xml"))
colnames(tbl.noa) <- c("camera", "email", "visible", "hasbeencalled", "name", "carrier", "roaming", "selected", "hascalled")
tbl.noa <- tbl.noa[, c("name", "carrier", "camera", "roaming", "email")]
tbl.noa$name <- as.character(tbl.noa$name)
tbl.noa$carrier <- as.character(tbl.noa$carrier)
tbl.noa$camera <- as.character(tbl.noa$camera) == "true"
tbl.noa$roaming <- as.character(tbl.noa$roaming) == "true"
tbl.noa$email <- as.character(tbl.noa$email) == "true"

tbl.nodes <- merge(tbl.nodes, tbl.noa, by="name")

printf("nodes: %d", nrow(tbl.nodes))
printf("edges: %d", nrow(tbl.edges))

   #  first, graph 1
g <- new("graphNEL", edgemode = "directed")
nodeDataDefaults(g, attr="type") <- "phone"
nodeDataDefaults(g, attr="carrier") <- "unassigned"
nodeDataDefaults(g, attr="label") <- "default node label"
nodeDataDefaults(g, attr="callsReceived") <- 0
nodeDataDefaults(g, attr="callsMade") <- 0
nodeDataDefaults(g, attr="camera") <- FALSE
nodeDataDefaults(g, attr="roaming") <- FALSE
nodeDataDefaults(g, attr="email") <- FALSE

edgeDataDefaults(g, attr="edgeType") <- "undefined"
edgeDataDefaults(g, attr="enabled") <- TRUE
g <- graph::addNode(sort(unique(tbl.nodes$name)), g)
nodeData(g, tbl.nodes$name, "carrier") <- tbl.nodes$carrier
nodeData(g, tbl.nodes$name, "label") <- tbl.nodes$name
nodeData(g, tbl.nodes$name, "camera") <- tbl.nodes$camera
nodeData(g, tbl.nodes$name, "roaming") <- tbl.nodes$roaming
nodeData(g, tbl.nodes$name, "email") <- tbl.nodes$email

tbl.edgesReciprocal <- subset(tbl.edges, reciprocal==TRUE)    # 46
dups <- which(duplicated(tbl.edgesReciprocal$signature))
tbl.edgesReciprocal <- tbl.edgesReciprocal[-dups,]
tbl.edgesOneWay     <- subset(tbl.edges, reciprocal==FALSE)   # 47

tbl.edgesReduced <- tbl.edges[-(which(duplicated(tbl.edges$signature))),]

g <- with(tbl.edgesReduced, graph::addEdge(a, b, g))

#g2 <- with(tbl.edgesSub2, graph::addEdge(a, b, g2))

edgeData(g, tbl.edgesReciprocal$a, tbl.edgesReciprocal$b, attr="edgeType") <- "reciprocal"
edgeData(g, tbl.edgesOneWay$a, tbl.edgesOneWay$b, attr="edgeType") <- "oneWay"


rcy <- RCyjs(9000:9010, graph=g, quiet=TRUE)
tbl.pos <- tbl.nodes[, 1:3]
colnames(tbl.pos) <- c("id", "x", "y")
#setPosition(rcy, tbl.pos)
httpSetStyle(rcy, "style.js")
restoreLayout(rcy, "layout.RData")
fit(rcy)
#selectNodes(rcy, c("7B", "7C"))
#httpAddGraph(rcy, g2)



gjson <- getJSON(rcy)
out <- file("cellphoneModel.json", "w")
writeChar(gjson, con=out, eos=NULL)
close(out)

# hand-edit that json network file:
#
#  1) change all \" to '
#  2) prepend "network = "; append ";"
#
# for style.js:
#
# ensure that it starts like this:
#  vizmap = [{
#  "title": "cellphone default",
#  "style": [
#      {selector: "node", css: {
#      "shape": "ellipse",
#
# and ends like this:
#
#        "overlay-opacity": 0.2,
#        "overlay-color": "gray",
#        "width": "2px",
#       }},
#  ]}];
