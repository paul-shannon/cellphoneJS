
function foo(){
    var x = 99;
    console.log(x);
    };

function resetKnockoutMenu(){
        console.log("resetKnockoutMenu");
        $("#knockoutByCarrierMenuItems").hide();
        $("#knockoutByPropertiesMenuItems").hide();
        $("#knockoutWithPropertyMenuItems").hide();
        $("#knockoutByCarrierMenuItems").hide();
        $("#knockoutMenuItems").hide();
};

function resetReactivateMenu (){
        console.log("resetReactivateMenu");
        $("#reactivateByCarrierMenuItems").hide();
        $("#reactivateByPropertiesMenuItems").hide();
        $("#reactivateWithPropertyMenuItems").hide();
        $("#reactivateByCarrierMenuItems").hide();
        $("#reactivateMenuItems").hide();
};


module.exports = {

    init: function(){
	
     $("#cyDiv").on("click", function(e) {
        if($("#knockoutMenuItems").is(":visible") || $("#reactivateMenuItems").is(":visible")) {
          $("#knockoutMenuItems").hide();
	  $("#reactivateMenuItems").hide();
	  }  // hide the menus if visible
        e.stopPropagation();
	e.preventDefault(); // propagation still occurs, but it seems inconsequential in this context
        });

     $("#knockoutMainMenuButton").on("click", function(e){
        console.log("main menu button: knockout");
        $("#knockoutMenuItems").toggle();
          // whether showing or hiding the first level menu
          // we always want the submenus hidden
        $("#knockoutByPropertiesMenuItems").hide();
        $("#knockoutByCarrierMenuItems").hide();
          // if another menu is up, hide it
        $("#reactivateMenuItems").hide()
        });

     $("#knockoutWithoutPropertyMenuHead").on("click", function(e){
        console.log("  phones without");
        $(this).next('ul').toggle();
        $("#knockoutWithPropertyMenuItems").hide();
        });

     $("#knockoutWithPropertyMenuHead").on("click", function(e){
        console.log("  phones with");
        $(this).next('ul').toggle();
        $("#knockoutWithoutPropertyMenuItems").hide();
        });

     $('#knockoutSelectedPhonesMenuItem').on("click", function(e){
        console.log("knockoutSelectedPhones");
        var selectedNodes = cy.nodes(":selected")
        selectedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutByPropertiesMenuHead").on("click", function(e){
        console.log("knockoutByPropertiesMenuHead click");
          // toggle the "Phones with, Phones without submenu
        $('#knockoutByPropertiesMenuItems').toggle()
          // make sure the "By Carrier" menu is hidden
        $("#knockoutByCarrierMenuItems").hide()
          // make sure the sub-sub menus are both hidden
        $("#knockoutWithPropertyMenuHead").next("ul").hide()
        $("#knockoutWithoutPropertyMenuHead").next("ul").hide()
        });

     $('#knockoutByCarrierMenuHead').on("click", function(e){
        console.log("knockoutByCarrierMenuHead click");
        $("#knockoutByCarrierMenuItems").toggle()
        $('#knockoutByPropertiesMenuItems').hide()
        });

     $("#knockoutSprintPhonesMenuItem").on("click", function(e){
        console.log("knockout sprint phones");
        var carrierNodes = cy.nodes("[carrier='Sprint']");
        carrierNodes.connectedEdges().hide()
        resetKnockoutMenu();
        });

     $("#reactivateSprintPhonesMenuItem").on("click", function(e){
        console.log("reactivate sprint phones");
        var carrierNodes = cy.nodes("[carrier='Sprint']");
        carrierNodes.connectedEdges().show();
        resetReactivateMenu();
        });

     $("#knockoutTMobilePhonesMenuItem").on("click", function(e){
        console.log("knockout t-mobile phones");
        var carrierNodes = cy.nodes("[carrier='T-Mobile']");
        carrierNodes.connectedEdges().hide()
        resetKnockoutMenu();
        });

      $("#knockoutATTPhonesMenuItem").on("click", function(e){
         console.log("knockout ATT phones");
         var carrierNodes = cy.nodes("[carrier='ATT']");
         carrierNodes.connectedEdges().hide()
         resetKnockoutMenu();
         });

      $("#knockoutNextelPhonesMenuItem").on("click", function(e){
         console.log("knockout nextel phones");
         var carrierNodes = cy.nodes("[carrier='Nextel']");
         carrierNodes.connectedEdges().hide()
         resetKnockoutMenu();
         });

      $("#knockoutVerizonPhonesMenuItem").on("click", function(e){
         console.log("knockout Verizon phones");
         var carrierNodes = cy.nodes("[carrier='Verizon Wireless']");
         carrierNodes.connectedEdges().hide()
         resetKnockoutMenu();
         });

      $("#knockoutCellularOnePhonesMenuItem").on("click", function(e){
         console.log("knockout cellular one phones");
         var carrierNodes = cy.nodes("[carrier='CellularOne']");
         carrierNodes.connectedEdges().hide()
         resetKnockoutMenu();
         });

      $("#knockoutUSCellularPhonesMenuItem").on("click", function(e){
         console.log("knockout us cellular phones");
         var carrierNodes = cy.nodes("[carrier='US Cellular']");
         carrierNodes.connectedEdges().hide()
         resetKnockoutMenu();
         });

      $("#reactivateNextelPhonesMenuItem").on("click", function(e){
         console.log("reactivate nextel phones");
         var carrierNodes = cy.nodes("[carrier='Nextel']");
         carrierNodes.connectedEdges().show();
         resetReactivateMenu();
         });

      $("#reactivateVerizonPhonesMenuItem").on("click", function(e){
         console.log("reactivate Verizon phones");
         var carrierNodes = cy.nodes("[carrier='Verizon Wireless']");
         carrierNodes.connectedEdges().show();
         resetReactivateMenu();
         });

      $("#reactivateCellularOnePhonesMenuItem").on("click", function(e){
         console.log("reactivate cellular one phones");
         var carrierNodes = cy.nodes("[carrier='US Cellular']");
         carrierNodes.connectedEdges().show();
         resetReactivateMenu();
         });

      $("#reactivateUSCellularPhonesMenuItem").on("click", function(e){
         console.log("reactivate us cellular phones");
         var carrierNodes = cy.nodes("[carrier='US Cellular']");
         carrierNodes.connectedEdges().show();
         resetReactivateMenu();
         });

     $('a.leafMenuItem').on("click", function(e){
        console.log("leafMenuItem click");
        console.log(e);
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
        });

     $("#knockoutWithoutEmailMenuItem").on("click", function(e){
        console.log("w/o email");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && !e.data("email"))});
        propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutWithoutRoamingMenuItem").on("click", function(e){
        console.log("w/o roaming");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && !e.data("roaming"))});
        propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutWithoutPhotoMenuItem").on("click", function(e){
        console.log("w/o camera");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && !e.data("camera"))});
         propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutWithEmailMenuItem").on("click", function(e){
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("email"))});
        propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutWithRoamingMenuItem").on("click", function(e){
        console.log("with roaming");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("roaming"))});
        propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     $("#knockoutWithCameraMenuItem").on("click", function(e){
        console.log("with camera");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("camera"))});
        propertiedNodes.connectedEdges().hide();
        resetKnockoutMenu();
        });

     // reactivate menu code starts here

     $("#reactivateMainMenuButton").on("click", function(e){
        console.log("main menu button: reactivate");
        $("#reactivateMenuItems").toggle();
          // whether showing or hiding the first level menu
          // we always want the submenus hidden
        $("#reactivateByPropertiesMenuItems").hide();
        $("#reactivateByCarrierMenuItems").hide();
          // if another menu is up, hide it
        $("#knockoutMenuItems").hide()

        });

     $("#reactivateWithoutPropertyMenuHead").on("click", function(e){
        console.log("  phones without");
        $(this).next('ul').toggle();
        $("#reactivateWithPropertyMenuItems").hide();
        });

     $("#reactivateWithPropertyMenuHead").on("click", function(e){
        console.log("  phones with");
        $(this).next('ul').toggle();
        $("#reactivateWithoutPropertyMenuItems").hide();
        });

     $('#reactivateSelectedPhonesMenuItem').on("click", function(e){
        console.log("reactivateSelectedPhones");
        var selectedNodes = cy.nodes(":selected")
         selectedNodes.connectedEdges().show();
        });

     $('#reactivateByCarrierMenuHead').on("click", function(e){
        console.log("reactivateByCarrier");
        $("#reactivateByCarrierMenuItems").toggle()
        $('#reactivateByPropertiesMenuItems').hide()
        //resetReactivateMenu();
        });

     $("#reactivateByPropertiesMenuHead").on("click", function(e){
        console.log("reactivateByPropertiesMenuHead click");
          // toggle the "Phones with, Phones without submenu
        $('#reactivateByPropertiesMenuItems').toggle()
          // make sure the "By Carrier" menu is hidden
        $("#reactivateByCarrierMenuItems").hide()
          // make sure the sub-sub menus are both hidden
        $("#reactivateWithPropertyMenuHead").next("ul").hide()
        $("#reactivateWithoutPropertyMenuHead").next("ul").hide()
        });

     $("#reactivateTMobilePhonesMenuItem").on("click", function(e){
        console.log("reactivate t-mobile phones");
        var carrierNodes = cy.nodes("[carrier='T-Mobile']");
        carrierNodes.connectedEdges().show();
        resetReactivateMenu();
        });

     $("#reactivateATTPhonesMenuItem").on("click", function(e){
         var carrierNodes = cy.nodes("[carrier='ATT']");
         carrierNodes.connectedEdges().show();
         resetReactivateMenu();
        });

     $('a.leafMenuItem').on("click", function(e){
        console.log("leafMenuItem click");
        console.log(e);
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
        });

     $("#reactivateWithoutEmailMenuItem").on("click", function(e){
        console.log("w/o email");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("email"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

     $("#reactivateWithoutRoamingMenuItem").on("click", function(e){
        console.log("w/o roaming");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && !e.data("roaming"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

     $("#reactivateWithoutPhotoMenuItem").on("click", function(e){
        console.log("w/o camera");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && !e.data("camera"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

     $("#reactivateWithEmailMenuItem").on("click", function(e){
        console.log("with email");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("email"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

     $("#reactivateWithRoamingMenuItem").on("click", function(e){
        console.log("with roaming");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("roaming"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

     $("#reactivateWithCameraMenuItem").on("click", function(e){
        console.log("with camera");
        var propertiedNodes = cy.filter(function(e){return (e.isNode() && e.data("camera"))});
        propertiedNodes.connectedEdges().show()
        resetReactivateMenu();
        });

    }

} // module.exports
