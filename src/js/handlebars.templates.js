this["iadesigner"] = this["iadesigner"] || {};

this["iadesigner"]["control.boldlabel.handlebars"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"iad-form-label\"><b>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</b></div>\r\n";
},"useData":true});

this["iadesigner"]["control.boolean.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"checkbox iad-checkbox\">\r\n	<label>\r\n		<input type=\"checkbox\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),"true",{"name":"ifEqualTo","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),true,{"name":"ifEqualTo","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"iad-control-checkbox\">\r\n		<div class=\"control-label>\r\n    		<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n		</div>\r\n	</label>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.button.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "style=\"text-align:right\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"action","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "title=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\""
    + container.escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></i>&nbsp;&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.align : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n	<button type=\"button\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.action : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"btn btn-sm btn-default iad-control-btn iad-tooltip-control\" data-toggle=\"tooltip\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.icon : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</button>\r\n</div>\r\n";
},"useData":true});

this["iadesigner"]["control.colour.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<button class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button> \r\n</div>\r\n";
},"useData":true});

this["iadesigner"]["control.float.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-number iad-control-float\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<span class=\"input-group-btn\">\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus\">-</button>\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus\">+</button>\r\n		</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});

this["iadesigner"]["control.floatcounter.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-number iad-control-float\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<span class=\"btn-group\">													\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus\">-</button>\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus\">+</button>\r\n		</span>\r\n	</div>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.integer.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<span class=\"input-group-btn\">\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n		</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});

this["iadesigner"]["control.integercounter.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<span class=\"btn-group\">													\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n			<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n		</span>\r\n	</div>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.integerselect.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"3":function(container,depth0,helpers,partials,data) {
    return "selected=\"true\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<select class=\"form-control input-sm iad-control-integer-select\">\r\n			<option value=\"-1\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,-1,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">-</option>\r\n			<option value=\"0\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,0,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">0</option>\r\n			<option value=\"1\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,1,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">1</option>\r\n			<option value=\"2\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,2,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">2</option>\r\n			<option value=\"3\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,3,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">3</option>\r\n			<option value=\"4\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,4,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">4</option>\r\n			<option value=\"5\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,5,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">5</option>\r\n			<option value=\"6\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,6,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">6</option>\r\n			<option value=\"7\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,7,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">7</option>\r\n			<option value=\"8\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,8,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">8</option>\r\n			<option value=\"9\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,9,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">9</option>\r\n			<option value=\"10\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,10,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">10</option>\r\n	</select>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.label.handlebars"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"iad-form-label\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n";
},"useData":true});

this["iadesigner"]["control.logic.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.text"],depth0,{"name":"control.text","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.textarea"],depth0,{"name":"control.textarea","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.textarealarge"],depth0,{"name":"control.textarealarge","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.label"],depth0,{"name":"control.label","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.boldlabel"],depth0,{"name":"control.boldlabel","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.integer"],depth0,{"name":"control.integer","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.float"],depth0,{"name":"control.float","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.integercounter"],depth0,{"name":"control.integercounter","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.integerselect"],depth0,{"name":"control.integerselect","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.floatcounter"],depth0,{"name":"control.floatcounter","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.boolean"],depth0,{"name":"control.boolean","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.select"],depth0,{"name":"control.select","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"25":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.colour"],depth0,{"name":"control.colour","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"27":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.range"],depth0,{"name":"control.range","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.textdropdownreplace"],depth0,{"name":"control.textdropdownreplace","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.textdropdownappend"],depth0,{"name":"control.textdropdownappend","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"33":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.textareadropdownappend"],depth0,{"name":"control.textareadropdownappend","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"35":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.separator"],depth0,{"name":"control.separator","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["control.button"],depth0,{"name":"control.button","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifTextControl || (depth0 && depth0.ifTextControl) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"ifTextControl","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea",{"name":"ifEqualTo","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea-large",{"name":"ifEqualTo","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"label",{"name":"ifEqualTo","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"bold-label",{"name":"ifEqualTo","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer",{"name":"ifEqualTo","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"float",{"name":"ifEqualTo","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer-counter",{"name":"ifEqualTo","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer-select",{"name":"ifEqualTo","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"float-counter",{"name":"ifEqualTo","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"boolean",{"name":"ifEqualTo","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"select",{"name":"ifEqualTo","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"colour",{"name":"ifEqualTo","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text",{"name":"ifEqualTo","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"range",{"name":"ifEqualTo","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text-dropdown-replace",{"name":"ifEqualTo","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text-dropdown-append",{"name":"ifEqualTo","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea-dropdown-append",{"name":"ifEqualTo","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"separator",{"name":"ifEqualTo","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"button",{"name":"ifEqualTo","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["iadesigner"]["control.range.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n    <div class=\"input-group\">\r\n	  <input class=\"iad-control-range\" type=\"range\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" min=\""
    + alias4(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"min","hash":{},"data":data}) : helper)))
    + "\" max=\""
    + alias4(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"max","hash":{},"data":data}) : helper)))
    + "\" step=\""
    + alias4(((helper = (helper = helpers.step || (depth0 != null ? depth0.step : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"step","hash":{},"data":data}) : helper)))
    + "\">\r\n      <div class=\"input-group-addon iad-range-value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\r\n    </div>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.select.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" style=\"font-family: "
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + ";\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].value : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return " selected=\"true\" ";
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "			<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].value : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "selected=\"true\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<select class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = (helpers.ifEndsWith || (depth0 && depth0.ifEndsWith) || alias2).call(alias1,(depth0 != null ? depth0.id : depth0),"font-family",{"name":"ifEndsWith","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "	</select>\r\n</div>";
},"useData":true,"useDepths":true});

this["iadesigner"]["control.separator.handlebars"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div style=\"border-bottom:1px solid #cccccc;margin:40px 0px 40px 0px\"></div>";
},"useData":true});

this["iadesigner"]["control.text.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<input class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n</div>";
},"useData":true});

this["iadesigner"]["control.textarea.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<textarea class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.textareadropdownappend.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.divider : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.header : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"divider\"></li>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"dropdown-header\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</li>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "						<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<textarea class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n		<div class=\"input-group-btn\" style=\"vertical-align:bottom\">\r\n			<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n			<ul class=\"dropdown-menu pull-right iad-dropdown-menu-append\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</ul>\r\n		</div>\r\n	</div>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.textarealarge.handlebars"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">\r\n	<textarea class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n</div>";
},"useData":true});

this["iadesigner"]["control.textdropdownappend.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + container.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i>&nbsp;";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.divider : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.header : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"divider\"></li>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"dropdown-header\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</li>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "						<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"control-label\">\r\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<div class=\"input-group-btn\">\r\n			<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n			<ul class=\"dropdown-menu pull-right iad-dropdown-menu-append\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</ul>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});

this["iadesigner"]["control.textdropdownreplace.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <span class=\"iad-popover-control\"><i class=\"hover-opaque fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + alias3((helpers.substring || (depth0 && depth0.substring) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),8,{"name":"substring","hash":{},"data":data}))
    + "\" data-title=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i> "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.divider : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.header : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"divider\"></li>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "						<li class=\"dropdown-header\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</li>\r\n";
},"10":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "						<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\r\n<div>\r\n	<div class=\"input-group\">\r\n		<input class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n		<div class=\"input-group-btn\">\r\n			<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n			<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</ul>\r\n		</div>\r\n	</div>\r\n</div>";
},"useData":true});

this["iadesigner"]["forms.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, buffer = 
  ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n		<div data-form-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-form-type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"iad-form panel panel-default "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    		<div id=\"collapse-"
    + alias4(container.lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + " iad-collapse\">\r\n\r\n				<div class=\"panel-body\">\r\n					<form class=\"draggableList\" role=\"form\" onsubmit=\"return false;\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.controls || (depth0 != null ? depth0.controls : depth0)) != null ? helper : alias2),(options={"name":"controls","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.controls) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</form>\r\n				</div>	\r\n			</div>\r\n		</div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <div class=\"panel-body\">\r\n            <div class=\"iad-form-description\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\r\n        </div>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "panel-accordion";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "				<div style=\"cursor:pointer\" class=\"panel-heading collapsed\" data-toggle=\"collapse\" data-parent=\"#"
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-accordion\" href=\"#collapse-"
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><span>&nbsp;&nbsp;"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span></div>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    return " ";
},"10":function(container,depth0,helpers,partials,data) {
    return "in";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"groupcontrol",{"name":"ifEqualTo","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.program(23, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"colour-dropdown",{"name":"ifEqualTo","hash":{},"fn":container.program(25, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-legend-editor",{"name":"ifEqualTo","hash":{},"fn":container.program(29, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-range-add",{"name":"ifEqualTo","hash":{},"fn":container.program(31, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-range",{"name":"ifEqualTo","hash":{},"fn":container.program(33, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-scheme-add",{"name":"ifEqualTo","hash":{},"fn":container.program(36, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-scheme",{"name":"ifEqualTo","hash":{},"fn":container.program(38, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, buffer = 
  "								<div data-control-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-control-index=\""
    + alias4(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"iad-control-group well well-sm iad-sortable\">\r\n\r\n									<div class=\"form-group iad-form-group\" data-control-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n										<div "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.sortable : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n											"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.sortable : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n											"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.removeable : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n										</div>\r\n									</div>\r\n";
  stack1 = ((helper = (helper = helpers.controls || (depth0 != null ? depth0.controls : depth0)) != null ? helper : alias2),(options={"name":"controls","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.controls) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "								</div>\r\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "class=\"iad-sort-handle\"";
},"16":function(container,depth0,helpers,partials,data) {
    return "<i class=\"fa fa-fw fa-sort\"></i>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<button type=\"button\" "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.action : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"close iad-control-btn iad-tooltip-control\" style=\"float:right\" data-toggle=\"tooltip\">&times;</button>";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"action","hash":{},"data":data}) : helper)))
    + "\"";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "										<div class=\"form-group iad-form-group\" data-control-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n"
    + ((stack1 = container.invokePartial(partials["control.logic"],depth0,{"name":"control.logic","data":data,"indent":"\t\t\t\t\t\t\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "										</div>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "								<div class=\"form-group iad-form-group\" data-control-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n"
    + ((stack1 = container.invokePartial(partials["control.logic"],depth0,{"name":"control.logic","data":data,"indent":"\t\t\t\t\t\t\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "								</div>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <div class=\"form-group iad-form-group\" data-control-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n                                    <div>\r\n                                        <div class=\"input-group\">\r\n                                            <div class=\"input-group-btn\" style=\"vertical-align:bottom\">\r\n                                                <button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "&nbsp;<span class=\"caret\"></span></button>\r\n                                                <ul class=\"dropdown-menu\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        <li class=\"iad-dropdown-option iad-dropdown-menu-colorpalette\">\r\n                                                        <a href=\"#\" data-value=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.colors : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </a></li>\r\n";
},"27":function(container,depth0,helpers,partials,data) {
    return "                                                                <span style=\"background:"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + ";border: 1px solid #ccc;\">&nbsp;&nbsp;</span>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\" data-control-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n									<div id=\"map-palettes-legend-editor\">\r\n\r\n									</div>\r\n								</div>\r\n";
},"31":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\" data-control-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n									<div style=\"text-align:right\">\r\n										<button type=\"button\" class=\"btn btn-sm btn-default iad-control-add iad-control-add-color-range iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new colour\"><i class=\"fa fa-fw fa-plus\"></i></button>\r\n									</div>\r\n								</div>\r\n";
},"33":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\" data-control-id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\">\r\n									<div class=\"input-group\">\r\n										<span class=\"btn-group\">\r\n											<button class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n"
    + ((stack1 = (helpers.noOfColorsGreaterThanTwo || (depth0 && depth0.noOfColorsGreaterThanTwo) || alias2).call(alias1,(depths[2] != null ? depths[2].controls : depths[2]),{"name":"noOfColorsGreaterThanTwo","hash":{},"fn":container.program(34, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "										</span>\r\n									</div>\r\n								</div>\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    return "												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-remove iad-control-remove-color-range iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n";
},"36":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <div class=\"form-group iad-form-group\" data-control-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n                                    <div style=\"text-align:right\">\r\n                                        <button data-control-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add iad-control-add-color-scheme iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new colour\"><i class=\"fa fa-fw fa-plus\"></i></button>\r\n                                    </div>\r\n                                </div>\r\n";
},"38":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\" data-control-id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\">\r\n									<div class=\"input-group\">\r\n		      							<span class=\"input-group-btn\">\r\n											<button data-control-id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</span>\r\n										<input data-control-id=\""
    + alias4(((helper = (helper = helpers["for-id"] || (depth0 != null ? depth0["for-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"for-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Associate this colour with a legend label\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["for-value"] || (depth0 != null ? depth0["for-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"for-value","hash":{},"data":data}) : helper)))
    + "\">\r\n"
    + ((stack1 = (helpers.noOfColorsGreaterThanTwo || (depth0 && depth0.noOfColorsGreaterThanTwo) || alias2).call(alias1,(depths[2] != null ? depths[2].controls : depths[2]),{"name":"noOfColorsGreaterThanTwo","hash":{},"fn":container.program(39, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "									</div>\r\n								</div>\r\n";
},"39":function(container,depth0,helpers,partials,data) {
    var helper;

  return "			      							<span class=\"input-group-btn\">\r\n												<button data-control-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-remove iad-control-remove-color-scheme iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n											</span>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", buffer = 
  "<div class=\"panel-group\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-accordion\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.forms || (depth0 != null ? depth0.forms : depth0)) != null ? helper : alias2),(options={"name":"forms","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.forms) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n</div>";
},"usePartial":true,"useData":true,"useDepths":true});

this["iadesigner"]["template-gallery.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, buffer = 
  "	<div id=\""
    + alias4(((helper = (helper = helpers.galleryId || (depth0 != null ? depth0.galleryId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"galleryId","hash":{},"data":data}) : helper)))
    + "\" class=\"iad-gallery\" "
    + ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n		<div class=\"iad-gallery-header\">"
    + alias4(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"header","hash":{},"data":data}) : helper)))
    + "</div>\r\n		<div class=\"iad-gallery-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\r\n\r\n		<div class=\"row\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.reports || (depth0 != null ? depth0.reports : depth0)) != null ? helper : alias2),(options={"name":"reports","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.reports) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		</div>\r\n	</div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "style=\"border-width:0px\"";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "				<!--div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\"-->\r\n					<div class=\"iad-thumbnail-header\">"
    + alias4(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"header","hash":{},"data":data}) : helper)))
    + "</div>\r\n					<div id=\""
    + alias4(((helper = (helper = helpers.reportId || (depth0 != null ? depth0.reportId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"reportId","hash":{},"data":data}) : helper)))
    + "\" class=\"thumbnail iad-thumbnail\">\r\n						<img src=\""
    + alias4((helpers.screenshotPath || (depth0 && depth0.screenshotPath) || alias2).call(alias1,depth0,{"name":"screenshotPath","hash":{},"data":data}))
    + "\" alt=\""
    + alias4((helpers.screenshotPath || (depth0 && depth0.screenshotPath) || alias2).call(alias1,depth0,{"name":"screenshotPath","hash":{},"data":data}))
    + "\"></img>\r\n						<div class=\"iad-thumbnail-hover\">\r\n							<div class=\"iad-thumbnail-info\">\r\n								<div class=\"iad-thumbnail-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\r\n							</div>\r\n							<div class=\"iad-thumbnail-btns\">\r\n"
    + ((stack1 = helpers["with"].call(alias1,((stack1 = (depths[2] != null ? depths[2].thumbnail : depths[2])) != null ? stack1.buttons : stack1),{"name":"with","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "							</div>\r\n						</div>\r\n					</div>\r\n				<!--/div-->\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "									<button type=\"button\" class=\"iad-template-gallery-preview-btn btn btn-xs btn-default\" ><span class=\"fa fa-fw fa-search\"></span>&nbsp;&nbsp;"
    + alias4(((helper = (helper = helpers.preview || (depth0 != null ? depth0.preview : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"preview","hash":{},"data":data}) : helper)))
    + "</button>\r\n									<button type=\"button\" class=\"iad-template-gallery-apply-btn btn btn-xs btn-info\"><span class=\"fa fa-fw fa-check\"></span>&nbsp;&nbsp;"
    + alias4(((helper = (helper = helpers.apply || (depth0 != null ? depth0.apply : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"apply","hash":{},"data":data}) : helper)))
    + "</button>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.galleries || (depth0 != null ? depth0.galleries : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"galleries","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.galleries) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});

this["iadesigner"]["widget-gallery.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.include : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "		<div class=\"iad-gallery-description\" style=\"padding:15px 15px 15px 15px;border-bottom: 1px solid #ddd;\">\r\n			"
    + alias1(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n			<br/><br/>\r\n			<div class=\"btn-group\" data-toggle=\"buttons\"> \r\n			    <label class=\"btn btn-default navbar-btn "
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.datasource1 : stack1)) != null ? stack1.active : stack1), depth0))
    + "\">\r\n			        <input type=\"radio\" name=\"iad-radio-widget-gallery-datasource\" value=\"0\" />"
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.datasource1 : stack1)) != null ? stack1.text : stack1), depth0))
    + "\r\n			    </label> \r\n			    <label class=\"btn btn-default navbar-btn "
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.datasource2 : stack1)) != null ? stack1.active : stack1), depth0))
    + "\">\r\n			        <input type=\"radio\" name=\"iad-radio-widget-gallery-datasource\" value=\"1\" />"
    + alias1(alias2(((stack1 = ((stack1 = (depth0 != null ? depth0.buttons : depth0)) != null ? stack1.datasource2 : stack1)) != null ? stack1.text : stack1), depth0))
    + "\r\n			    </label> \r\n			</div>\r\n		</div>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.include : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, buffer = 
  "		<div class=\"iad-gallery\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.first : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n			<div class=\"iad-gallery-header\">"
    + alias4(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"header","hash":{},"data":data}) : helper)))
    + "</div>\r\n			<div class=\"iad-gallery-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\r\n\r\n			<div class=\"row\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.widgets || (depth0 != null ? depth0.widgets : depth0)) != null ? helper : alias2),(options={"name":"widgets","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.widgets) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n			</div>\r\n		</div>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "style=\"border-width:0px\"";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.include : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "						<!--div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\"-->\r\n							<div class=\"iad-thumbnail-header\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n							<div data-widget-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"thumbnail iad-thumbnail iad-widget-thumbnail\">\r\n								<img src=\"./config/component-icons/"
    + alias4(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\" alt=\"./config/component-icons/"
    + alias4(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\"></img>\r\n								<div class=\"iad-thumbnail-hover-clickable\">\r\n									"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n								</div>\r\n							</div>\r\n						<!--/div-->	\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "\r\n";
  stack1 = ((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias2),(options={"name":"header","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.header) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = ((helper = (helper = helpers.galleries || (depth0 != null ? depth0.galleries : depth0)) != null ? helper : alias2),(options={"name":"galleries","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.galleries) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});