this["iadesigner"] = this["iadesigner"] || {};

this["iadesigner"]["config-gallery.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
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

  return "				<div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\">\r\n					<div class=\"iad-thumbnail-header\">"
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
    + "							</div>\r\n						</div>\r\n					</div>\r\n				</div>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "									<button type=\"button\" class=\"iad-config-gallery-preview-btn btn btn-xs btn-default\" ><span class=\"fa fa-fw fa-search\"></span>&nbsp;&nbsp;"
    + alias4(((helper = (helper = helpers.preview || (depth0 != null ? depth0.preview : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"preview","hash":{},"data":data}) : helper)))
    + "</button>\r\n									<button type=\"button\" class=\"iad-config-gallery-apply-btn btn btn-xs btn-default\"><span class=\"fa fa-fw fa-check\"></span>&nbsp;&nbsp;"
    + alias4(((helper = (helper = helpers.apply || (depth0 != null ? depth0.apply : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"apply","hash":{},"data":data}) : helper)))
    + "</button>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = "";

  stack1 = ((helper = (helper = helpers.galleries || (depth0 != null ? depth0.galleries : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"galleries","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!helpers.galleries) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});

this["iadesigner"]["forms.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=helpers.helperMissing, alias4="function", buffer = 
  ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n		<div class=\"panel panel-default\" "
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    		<div id=\"collapse-"
    + alias2(container.lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + " iad-collapse\">\r\n\r\n				<div class=\"panel-body\">\r\n					<form class=\"draggableList\" role=\"form\" onsubmit=\"return false;\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.controls || (depth0 != null ? depth0.controls : depth0)) != null ? helper : alias3),(options={"name":"controls","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias4 ? helper.call(alias1,options) : helper));
  if (!helpers.controls) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</form>\r\n				</div>	\r\n			</div>\r\n		</div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        <div class=\"panel-body\">\r\n            <div class=\"iad-form-description\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\r\n        </div>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "style=\"border-bottom-width:0px\"";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "				<div style=\"cursor:pointer\" class=\"panel-heading collapsed\" data-toggle=\"collapse\" data-parent=\"#"
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-accordion\" href=\"#collapse-"
    + alias2(alias1((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><span>&nbsp;"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span></div>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    return " ";
},"10":function(container,depth0,helpers,partials,data) {
    return "in";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "\r\n							<!-- Map Palettes -->\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-legend-editor",{"name":"ifEqualTo","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-range-add",{"name":"ifEqualTo","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-range",{"name":"ifEqualTo","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-scheme-add",{"name":"ifEqualTo","hash":{},"fn":container.program(20, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"map-palettes-color-scheme",{"name":"ifEqualTo","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Standard -->\r\n"
    + ((stack1 = (helpers.ifTextControl || (depth0 && depth0.ifTextControl) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"ifTextControl","hash":{},"fn":container.program(25, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea",{"name":"ifEqualTo","hash":{},"fn":container.program(30, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea-large",{"name":"ifEqualTo","hash":{},"fn":container.program(32, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"label",{"name":"ifEqualTo","hash":{},"fn":container.program(34, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"bold-label",{"name":"ifEqualTo","hash":{},"fn":container.program(36, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer",{"name":"ifEqualTo","hash":{},"fn":container.program(38, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"float",{"name":"ifEqualTo","hash":{},"fn":container.program(40, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer-counter",{"name":"ifEqualTo","hash":{},"fn":container.program(42, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"integer-select",{"name":"ifEqualTo","hash":{},"fn":container.program(44, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"float-counter",{"name":"ifEqualTo","hash":{},"fn":container.program(47, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"boolean",{"name":"ifEqualTo","hash":{},"fn":container.program(49, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"select",{"name":"ifEqualTo","hash":{},"fn":container.program(52, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"colour",{"name":"ifEqualTo","hash":{},"fn":container.program(60, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"colour-dropdown",{"name":"ifEqualTo","hash":{},"fn":container.program(65, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text",{"name":"ifEqualTo","hash":{},"fn":container.program(25, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"range",{"name":"ifEqualTo","hash":{},"fn":container.program(69, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text-dropdown-replace",{"name":"ifEqualTo","hash":{},"fn":container.program(71, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"text-dropdown-append",{"name":"ifEqualTo","hash":{},"fn":container.program(79, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"textarea-dropdown-append",{"name":"ifEqualTo","hash":{},"fn":container.program(81, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"separator",{"name":"ifEqualTo","hash":{},"fn":container.program(83, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Tables -->\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"column",{"name":"ifEqualTo","hash":{},"fn":container.program(85, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"column-add",{"name":"ifEqualTo","hash":{},"fn":container.program(88, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Area Profile -->				\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"chart-column",{"name":"ifEqualTo","hash":{},"fn":container.program(90, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"symbol-column",{"name":"ifEqualTo","hash":{},"fn":container.program(105, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"target-add",{"name":"ifEqualTo","hash":{},"fn":container.program(117, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"symbol-add",{"name":"ifEqualTo","hash":{},"fn":container.program(119, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"break-add",{"name":"ifEqualTo","hash":{},"fn":container.program(121, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"profile-symbol",{"name":"ifEqualTo","hash":{},"fn":container.program(123, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"profile-target",{"name":"ifEqualTo","hash":{},"fn":container.program(126, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"profile-break",{"name":"ifEqualTo","hash":{},"fn":container.program(128, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Menu Bar -->\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"menu-bar",{"name":"ifEqualTo","hash":{},"fn":container.program(130, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"menu-bar-add",{"name":"ifEqualTo","hash":{},"fn":container.program(132, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Data Properties -->\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"data-textarea",{"name":"ifEqualTo","hash":{},"fn":container.program(134, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"data-string",{"name":"ifEqualTo","hash":{},"fn":container.program(136, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"data-boolean",{"name":"ifEqualTo","hash":{},"fn":container.program(139, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"data-text-dropdown-replace",{"name":"ifEqualTo","hash":{},"fn":container.program(141, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"open-data-properties-form",{"name":"ifEqualTo","hash":{},"fn":container.program(143, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                            \r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"open-map-layers-form",{"name":"ifEqualTo","hash":{},"fn":container.program(145, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n							<!-- Pyramid -->\r\n"
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"pyramid-line-add",{"name":"ifEqualTo","hash":{},"fn":container.program(151, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"pyramid-line",{"name":"ifEqualTo","hash":{},"fn":container.program(153, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "								<div class=\"form-group iad-form-group\">\r\n									<div id=\"map-palettes-legend-editor\">\r\n\r\n									</div>\r\n								</div>\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-color-range iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new colour\"><i class=\"fa fa-fw fa-plus\"></i></button>\r\n									</div>\r\n								</div>\r\n";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"input-group\">\r\n										<span class=\"btn-group\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n"
    + ((stack1 = (helpers.noOfColorsGreaterThanTwo || (depth0 && depth0.noOfColorsGreaterThanTwo) || alias2).call(alias1,(depths[2] != null ? depths[2].controls : depths[2]),{"name":"noOfColorsGreaterThanTwo","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "										</span>\r\n									</div>\r\n								</div>\r\n";
},"18":function(container,depth0,helpers,partials,data) {
    var helper;

  return "												<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-remove-color-range iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n";
},"20":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                <div class=\"form-group iad-form-group\">\r\n                                    <div style=\"text-align:right\">\r\n                                        <button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-color-scheme iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new colour\"><i class=\"fa fa-fw fa-plus\"></i></button>\r\n                                    </div>\r\n                                </div>\r\n";
},"22":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"input-group\">\r\n		      							<span class=\"input-group-btn\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</span>\r\n										<input id=\""
    + alias4(((helper = (helper = helpers["for-id"] || (depth0 != null ? depth0["for-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"for-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Associate this colour with a legend label\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["for-value"] || (depth0 != null ? depth0["for-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"for-value","hash":{},"data":data}) : helper)))
    + "\">\r\n"
    + ((stack1 = (helpers.noOfColorsGreaterThanTwo || (depth0 && depth0.noOfColorsGreaterThanTwo) || alias2).call(alias1,(depths[2] != null ? depths[2].controls : depths[2]),{"name":"noOfColorsGreaterThanTwo","hash":{},"fn":container.program(23, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "									</div>\r\n								</div>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var helper;

  return "			      							<span class=\"input-group-btn\">\r\n												<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-remove-color-scheme iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n											</span>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n									</div>\r\n								</div>\r\n";
},"26":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "                                        <span class=\"iad-popover-control\"><i class=\"hover-opaque fa fa-fw fa-question-circle iad-popover\" data-toggle=\"popover\" data-trigger=\"click\" data-content=\""
    + alias3((helpers.substring || (depth0 && depth0.substring) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),8,{"name":"substring","hash":{},"data":data}))
    + "\" data-title=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" data-container=\"body\"></i> "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
},"28":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                        <span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n";
},"30":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<textarea id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n									</div>\r\n								</div>\r\n";
},"32":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">\r\n										<textarea id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n									</div>\r\n								</div>\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"iad-form-label\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n								</div>\r\n";
},"36":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"iad-form-label\"><b>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</b></div>\r\n								</div>\r\n";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"40":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-float\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"btn-group\">													\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"44":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<select id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-integer-select\">\r\n												<option value=\"-1\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,-1,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">-</option>\r\n												<option value=\"0\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,0,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">0</option>\r\n												<option value=\"1\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,1,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">1</option>\r\n												<option value=\"2\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,2,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">2</option>\r\n												<option value=\"3\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,3,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">3</option>\r\n												<option value=\"4\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,4,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">4</option>\r\n												<option value=\"5\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,5,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">5</option>\r\n												<option value=\"6\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,6,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">6</option>\r\n												<option value=\"7\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,7,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">7</option>\r\n												<option value=\"8\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,8,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">8</option>\r\n												<option value=\"9\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,9,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">9</option>\r\n												<option value=\"10\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,10,(depth0 != null ? depth0.value : depth0),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">10</option>\r\n										</select>\r\n									</div>\r\n								</div>\r\n";
},"45":function(container,depth0,helpers,partials,data) {
    return "selected=\"true\"";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-float\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"btn-group\">													\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n										<div class=\"checkbox\">\r\n											<label>\r\n												<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"checkbox\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),"true",{"name":"ifEqualTo","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),true,{"name":"ifEqualTo","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"iad-control-checkbox\"><span class=\"control-label iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</label>\r\n										</div>\r\n								</div>\r\n";
},"50":function(container,depth0,helpers,partials,data) {
    return "checked";
},"52":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0, blockParams, depths),"inverse":container.program(28, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n                                        <input type=\"hidden\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-current\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" />\r\n										<select id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = (helpers.ifEndsWith || (depth0 && depth0.ifEndsWith) || alias2).call(alias1,(depth0 != null ? depth0.id : depth0),"font-family",{"name":"ifEndsWith","hash":{},"fn":container.program(53, data, 0, blockParams, depths),"inverse":container.program(57, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "										</select>\r\n									</div>\r\n								</div>\r\n";
},"53":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(54, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"54":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                            <option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" style=\"font-family: "
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + ";\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].value : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(55, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"55":function(container,depth0,helpers,partials,data) {
    return " selected=\"true\" ";
},"57":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(58, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "												<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].value : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"60":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.PropertyGroup : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.program(63, data, 0),"data":data})) != null ? stack1 : "")
    + "\r\n									</div>\r\n								</div>\r\n";
},"61":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "											<span class=\"btn-group\">\r\n												<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button> \r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-update-config-btn\"><i class=\"fa fa-fw fa-refresh\"></i></button>\r\n											</span>\r\n";
},"63":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button> \r\n";
},"65":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <div class=\"form-group iad-form-group\">\r\n                                    <div>\r\n                                        <div class=\"input-group\">\r\n                                            <div class=\"input-group-btn\" style=\"vertical-align:bottom\">\r\n                                                <button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "&nbsp;<span class=\"caret\"></span></button>\r\n                                                <ul class=\"dropdown-menu\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                </ul>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n";
},"66":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                                                        <li class=\"iad-dropdown-option iad-dropdown-menu-colorpalette\">\r\n                                                        <a href=\"#\" data-value=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.colors : depth0),{"name":"each","hash":{},"fn":container.program(67, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                                        </a></li>\r\n";
},"67":function(container,depth0,helpers,partials,data) {
    return "                                                                <span style=\"background:"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + ";border: 1px solid #ccc;\">&nbsp;&nbsp;</span>\r\n";
},"69":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n                                        <div class=\"input-group\">\r\n										  <input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"iad-control-range\" type=\"range\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" min=\""
    + alias4(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"min","hash":{},"data":data}) : helper)))
    + "\" max=\""
    + alias4(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"max","hash":{},"data":data}) : helper)))
    + "\" step=\""
    + alias4(((helper = (helper = helpers.step || (depth0 != null ? depth0.step : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"step","hash":{},"data":data}) : helper)))
    + "\">\r\n                                          <div class=\"input-group-addon iad-range-value\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\r\n                                        </div>\r\n									</div>\r\n								</div>\r\n";
},"71":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<div class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>\r\n											</div>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"72":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.divider : depth0),{"name":"if","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.header : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"73":function(container,depth0,helpers,partials,data) {
    return "															<li class=\"divider\"></li>\r\n";
},"75":function(container,depth0,helpers,partials,data) {
    return "															<li class=\"dropdown-header\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</li>\r\n";
},"77":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "															<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"79":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<div class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-append\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>\r\n											</div>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"81":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n"
    + ((stack1 = (helpers.ifStartsWith || (depth0 && depth0.ifStartsWith) || alias2).call(alias1,(depth0 != null ? depth0.description : depth0),"popover:",{"name":"ifStartsWith","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "")
    + "									</div>\r\n									<div>\r\n										<div class=\"input-group\">\r\n											<textarea id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-textarea iad-control-text\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n											<div class=\"input-group-btn\" style=\"vertical-align:bottom\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-append\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>\r\n											</div>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"83":function(container,depth0,helpers,partials,data) {
    return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"border-bottom:1px solid #cccccc;margin:40px 0px 40px 0px\"></div>\r\n								</div>\r\n";
},"85":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"well well-sm iad-sortable\">\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"iad-sort-handle\">\r\n											<i class=\"fa fa-fw fa-sort\"></i>\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-column iad-tooltip-control\" style=\"float:right\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column Title\">Title</span>\r\n										</div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["alias-id"] || (depth0 != null ? depth0["alias-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["alias-value"] || (depth0 != null ? depth0["alias-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["alias-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>		\r\n											</span>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column data source\">Source</span>\r\n										</div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["data-value"] || (depth0 != null ? depth0["data-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<div class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(86, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>\r\n											</div>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column width\">Width</span>\r\n										</div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["width-id"] || (depth0 != null ? depth0["width-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" style=\"display:none\" value=\""
    + alias4(((helper = (helper = helpers["width-value"] || (depth0 != null ? depth0["width-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"btn-group\">																						\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease column width\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase column width\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"86":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "														<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"88":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-column iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add Column\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Column</button>\r\n									</div>\r\n								</div>\r\n";
},"90":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"well well-sm iad-sortable\">\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"iad-sort-handle\">\r\n											<i class=\"fa fa-fw fa-sort\"></i>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column Title\">Title</span>\r\n										</div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["alias-id"] || (depth0 != null ? depth0["alias-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["alias-value"] || (depth0 != null ? depth0["alias-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["alias-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>		\r\n											</span>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column width\">Width</span>\r\n										</div>\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["width-id"] || (depth0 != null ? depth0["width-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" style=\"display:none\" value=\""
    + alias4(((helper = (helper = helpers["width-value"] || (depth0 != null ? depth0["width-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<span class=\"btn-group\">																						\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease column width\">-</button>\r\n												<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase column width\">+</button>\r\n											</span>\r\n										</div>\r\n									</div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["health-min-id"] : depth0),{"name":"if","hash":{},"fn":container.program(91, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["profile-min-id"] : depth0),{"name":"if","hash":{},"fn":container.program(100, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["profile-color-id"] : depth0),{"name":"if","hash":{},"fn":container.program(102, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n								</div>\r\n";
},"91":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\r\n										<div class=\"well well-sm\">\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"iad-form-label\"><b>Column Labels</b></div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The left label\">Left label</span>\r\n												</div>\r\n												<div>\r\n													<input id=\""
    + alias4(((helper = (helper = helpers["health-min-id"] || (depth0 != null ? depth0["health-min-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-min-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["health-min-value"] || (depth0 != null ? depth0["health-min-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-min-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The centre label\">Centre label</span>\r\n												</div>\r\n												<div>\r\n													<input id=\""
    + alias4(((helper = (helper = helpers["health-mid-id"] || (depth0 != null ? depth0["health-mid-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-mid-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["health-mid-value"] || (depth0 != null ? depth0["health-mid-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-mid-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The right label\">Right label</span>\r\n												</div>\r\n												<div>\r\n													<input id=\""
    + alias4(((helper = (helper = helpers["health-max-id"] || (depth0 != null ? depth0["health-max-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-max-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["health-max-value"] || (depth0 != null ? depth0["health-max-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-max-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												</div>\r\n											</div>\r\n										</div>\r\n\r\n										<div class=\"well well-sm\">\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"iad-form-label\"><b>Area Symbol</b></div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The data source containing the values that define the position of the symbol.\">Position Source</span>\r\n												</div>\r\n												<div>\r\n													<select id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(92, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</select>\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The data source containing the values that define the symbol used to render the area symbol. Use the 'Symbols' section below to map values in the data source to a symbol.\">Symbol Source</span>\r\n												</div>\r\n												<div>\r\n													<select id=\""
    + alias4(((helper = (helper = helpers["symbol-id"] || (depth0 != null ? depth0["symbol-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"symbol-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["symbol-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(94, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</select>\r\n												</div>\r\n											</div>\r\n\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["health-symbol-color-id"] : depth0),{"name":"if","hash":{},"fn":container.program(96, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "										</div>\r\n\r\n										<div class=\"well well-sm\">\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"By default each chart is centred on the median value. You can override this by providing a data source. Use the 'Chart Column Targets' section below to add a central line based on the values in your data source.\">Centre Value</span>\r\n												</div>\r\n												<div>\r\n													<select id=\""
    + alias4(((helper = (helper = helpers["national-id"] || (depth0 != null ? depth0["national-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"national-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["national-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(98, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</select>\r\n												</div>\r\n											</div>\r\n										</div>		\r\n";
},"92":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "															<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["data-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"94":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "															<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["symbol-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"96":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "												<div class=\"form-group iad-form-group\">\r\n													<div class=\"control-label\">\r\n														<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The colour of the symbol.\">Colour</span>\r\n													</div>\r\n													<div>\r\n														<button id=\""
    + alias4(((helper = (helper = helpers["health-symbol-color-id"] || (depth0 != null ? depth0["health-symbol-color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-symbol-color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["health-symbol-color-value"] || (depth0 != null ? depth0["health-symbol-color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"health-symbol-color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button> \r\n													</div>\r\n												</div>\r\n";
},"98":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "															<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["national-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"100":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "										<div class=\"well well-sm\">\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"iad-form-label\"><b>Column Values</b></div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers["profile-min-description"] || (depth0 != null ? depth0["profile-min-description"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-min-description","hash":{},"data":data}) : helper)))
    + "\">Min. Value</span>\r\n												</div>\r\n												<div>\r\n													<div class=\"input-group\">\r\n														<input id=\""
    + alias4(((helper = (helper = helpers["profile-min-id"] || (depth0 != null ? depth0["profile-min-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-min-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-float\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["profile-min-value"] || (depth0 != null ? depth0["profile-min-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-min-value","hash":{},"data":data}) : helper)))
    + "\">\r\n														<span class=\"input-group-btn\">\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n														</span>\r\n													</div>											\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers["profile-max-description"] || (depth0 != null ? depth0["profile-max-description"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-max-description","hash":{},"data":data}) : helper)))
    + "\">Max. Value</span>\r\n												</div>\r\n												<div>\r\n													<div class=\"input-group\">\r\n														<input id=\""
    + alias4(((helper = (helper = helpers["profile-max-id"] || (depth0 != null ? depth0["profile-max-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-max-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-float\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["profile-max-value"] || (depth0 != null ? depth0["profile-max-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-max-value","hash":{},"data":data}) : helper)))
    + "\">\r\n														<span class=\"input-group-btn\">\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus\">-</button>\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus\">+</button>\r\n														</span>\r\n													</div>											\r\n												</div>\r\n											</div>\r\n										</div>\r\n";
},"102":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\r\n										<div class=\"well well-sm\">\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"iad-form-label\"><b>Bar</b></div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Data to be associated with the bar.\">Data Source</span>\r\n												</div>\r\n												<div>\r\n													<select id=\""
    + alias4(((helper = (helper = helpers["profile-data-id"] || (depth0 != null ? depth0["profile-data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["profile-data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(103, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</select>\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The height of the bar.\">Height</span>\r\n												</div>\r\n												<div>\r\n													<div class=\"input-group\">\r\n														<input id=\""
    + alias4(((helper = (helper = helpers["profile-height-id"] || (depth0 != null ? depth0["profile-height-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-height-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers["profile-height-value"] || (depth0 != null ? depth0["profile-height-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-height-value","hash":{},"data":data}) : helper)))
    + "\">\r\n														<div class=\"input-group-btn\">\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease height\">-</button>\r\n															<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase height\">+</button>\r\n														</div>\r\n													</div>\r\n												</div>\r\n											</div>\r\n\r\n											<div class=\"form-group iad-form-group\">\r\n												<div class=\"control-label\">\r\n													<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The colour of the bar. This is overridden if the 'Selected Features Legend' is included.\">Colour</span>\r\n												</div>\r\n												<div>\r\n													<button id=\""
    + alias4(((helper = (helper = helpers["profile-color-id"] || (depth0 != null ? depth0["profile-color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["profile-color-value"] || (depth0 != null ? depth0["profile-color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile-color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button> \r\n												</div>\r\n											</div>\r\n										</div>\r\n";
},"103":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "															<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["profile-data-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"105":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\r\n								<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"well well-sm iad-sortable\">\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"iad-sort-handle\">\r\n											<i class=\"fa fa-fw fa-sort\"></i>\r\n 											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-column iad-tooltip-control\" style=\"float:right\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column Title\">Title</span>\r\n										</div>\r\n										<div>\r\n											<div class=\"input-group\">\r\n												<input id=\""
    + alias4(((helper = (helper = helpers["alias-id"] || (depth0 != null ? depth0["alias-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["alias-value"] || (depth0 != null ? depth0["alias-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alias-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												<span class=\"input-group-btn\">\r\n													<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n													<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["alias-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(106, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</ul>		\r\n												</span>\r\n											</div>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column data source\">Data Source</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(113, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"A data source that will be rendered as a symbol. Use the 'Symbols' section below to map values in the data source to a symbol.\">Symbol Source</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["symbol-id"] || (depth0 != null ? depth0["symbol-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"symbol-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["symbol-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(115, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Column width\">Width</span>\r\n										</div>\r\n										<div>\r\n											<div class=\"input-group\">\r\n												<input id=\""
    + alias4(((helper = (helper = helpers["width-id"] || (depth0 != null ? depth0["width-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" style=\"display:none\" value=\""
    + alias4(((helper = (helper = helpers["width-value"] || (depth0 != null ? depth0["width-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"width-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												<span class=\"btn-group\">																						\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease column width\">-</button>\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-float-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase column width\">+</button>\r\n												</span>\r\n											</div>\r\n										</div>\r\n									</div>\r\n\r\n								</div>\r\n";
},"106":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.divider : depth0),{"name":"if","hash":{},"fn":container.program(107, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.header : depth0),{"name":"if","hash":{},"fn":container.program(109, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(111, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"107":function(container,depth0,helpers,partials,data) {
    return "																<li class=\"divider\"></li>\r\n";
},"109":function(container,depth0,helpers,partials,data) {
    return "																<li class=\"dropdown-header\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.header : depth0), depth0))
    + "</li>\r\n";
},"111":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "																<li class=\"iad-dropdown-option\"><a href=\"#\" data-value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a></li>\r\n";
},"113":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "													<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["data-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"115":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "													<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["symbol-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"117":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-target iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new target\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Target</button>\r\n									</div>\r\n								</div>\r\n";
},"119":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-symbol iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new symbol\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Symbol</button>\r\n									</div>\r\n								</div>\r\n";
},"121":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-break iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new break\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Break</button>\r\n									</div>\r\n								</div>\r\n";
},"123":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"well well-sm\">\r\n									<div class=\"form-group iad-form-group\">\r\n										<div style=\"text-align:right\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-symbol iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"The data value to be associated with the symbol\">Data Value</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["data-value"] || (depth0 != null ? depth0["data-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Symbol label\">Label</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["label-id"] || (depth0 != null ? depth0["label-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["label-value"] || (depth0 != null ? depth0["label-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Symbol shape\">Shape</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["shape-id"] || (depth0 != null ? depth0["shape-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shape-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["shape-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(124, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Symbol size\">Size</span>\r\n										</div>\r\n										<div>\r\n											<div class=\"input-group\">\r\n												<input id=\""
    + alias4(((helper = (helper = helpers["size-id"] || (depth0 != null ? depth0["size-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers["size-value"] || (depth0 != null ? depth0["size-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												<span class=\"input-group-btn\">													\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease size\">-</button>\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase size\">+</button>\r\n												</span>\r\n											</div>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Symbol colour\">Colour</span>\r\n										</div>\r\n										<div>\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"124":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "													<option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1]["shape-value"] : depths[1]),{"name":"ifEqualTo","hash":{},"fn":container.program(45, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</option>\r\n";
},"126":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"well well-sm\">\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div style=\"text-align:right\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-target iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Data to be associated with the target\">Data</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(113, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n										\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Target label\">Label</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["label-id"] || (depth0 != null ? depth0["label-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["label-value"] || (depth0 != null ? depth0["label-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Target shape\">Shape</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["shape-id"] || (depth0 != null ? depth0["shape-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shape-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["shape-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(124, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Target size\">Size</span>\r\n										</div>\r\n										<div>\r\n											<div class=\"input-group\">\r\n												<input id=\""
    + alias4(((helper = (helper = helpers["size-id"] || (depth0 != null ? depth0["size-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-number iad-control-integer\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = helpers["size-value"] || (depth0 != null ? depth0["size-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												<span class=\"input-group-btn\">													\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-minus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Decrease size\">-</button>\r\n													<button type=\"button\" class=\"btn btn-sm btn-default iad-control-integer-plus iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Increase size\">+</button>\r\n												</span>\r\n											</div>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Target colour\">Colour</span>\r\n										</div>\r\n										<div>\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"128":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"well well-sm\">\r\n									<div class=\"form-group iad-form-group\">\r\n										<div style=\"text-align:right\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-break iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Break label\">Label</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["label-id"] || (depth0 != null ? depth0["label-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["label-value"] || (depth0 != null ? depth0["label-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Break colour\">Colour</span>\r\n										</div>\r\n										<div>\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"130":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"well well-sm\">\r\n									<div class=\"form-group iad-form-group\">\r\n										<div style=\"text-align:right\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-menu-item iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers["label-description"] || (depth0 != null ? depth0["label-description"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-description","hash":{},"data":data}) : helper)))
    + "\">Label</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["label-id"] || (depth0 != null ? depth0["label-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["label-value"] || (depth0 != null ? depth0["label-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers["func-description"] || (depth0 != null ? depth0["func-description"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"func-description","hash":{},"data":data}) : helper)))
    + "\">Function</span>\r\n										</div>\r\n										<div>\r\n											<div class=\"input-group\">\r\n												<input id=\""
    + alias4(((helper = (helper = helpers["func-id"] || (depth0 != null ? depth0["func-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"func-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["func-value"] || (depth0 != null ? depth0["func-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"func-value","hash":{},"data":data}) : helper)))
    + "\">\r\n												<div class=\"input-group-btn\">\r\n													<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n													<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["func-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(106, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "													</ul>\r\n												</div>\r\n											</div>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"132":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-menu-item iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new item\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Item</button>\r\n									</div>\r\n								</div>\r\n";
},"134":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n										<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</div>\r\n									<div>\r\n										<textarea id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-textarea iad-control-text iad-data-control\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</textarea>\r\n									</div>\r\n								</div>\r\n";
},"136":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"control-label\">\r\n										<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</div>\r\n									<div>\r\n										<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text iad-data-control\" type=\"text\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(137, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " placeholder=\""
    + alias4(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\">\r\n									</div>\r\n								</div>\r\n";
},"137":function(container,depth0,helpers,partials,data) {
    var helper;

  return "value=\""
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"139":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"checkbox\">\r\n										<label>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"checkbox\" "
    + ((stack1 = (helpers.ifEqualTo || (depth0 && depth0.ifEqualTo) || alias2).call(alias1,(depths[1] != null ? depths[1].value : depths[1]),"true",{"name":"ifEqualTo","hash":{},"fn":container.program(50, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"iad-control-checkbox iad-data-control\"><span class=\"control-label iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n										</label>\r\n									</div>\r\n								</div>\r\n";
},"141":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">\r\n										<div class=\"input-group\">\r\n											<input id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text iad-data-control\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\r\n											<div class=\"input-group-btn\">\r\n												<button type=\"button\" class=\"btn btn-sm btn-default dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r\n												<ul class=\"dropdown-menu pull-right iad-dropdown-menu-replace\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "												</ul>\r\n											</div>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"143":function(container,depth0,helpers,partials,data) {
    return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button type=\"button\" class=\"btn btn-sm btn-default\" data-toggle=\"modal\" data-target=\"#iad-modal-data-properties\">"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.label : depth0), depth0))
    + "</button>	\r\n									</div>\r\n								</div>\r\n";
},"145":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <div class=\"form-group iad-form-group\">\r\n                                <div class=\"control-label\">\r\n                                    <span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n                                </div>\r\n                                <div class=\"control-label\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(146, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                    <!--<ul class=\"list-unstyled text-left\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.choices : depth0),{"name":"each","hash":{},"fn":container.program(148, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                    </ul>-->\r\n                                </div>\r\n                            </div>\r\n";
},"146":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                                    <div style=\"margin-top: -0.5em;\">\r\n                                        <button type=\"button\" class=\"btn btn-sm btn-default iad-tooltip-control\" data-toggle=\"modal\" data-target=\"#iad-modal-layer-manager\" title=\""
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "\" data-toggle=\"tooltip\">\r\n                                            <span class=\"fa-stack iad-layers-icon\"><i class=\"fa fa-fw fa-stop fa-stack-1x\"></i><i class=\"fa fa-fw fa-stop fa-stack-1x\"></i><i class=\"fa fa-fw fa-stop fa-stack-1x\"></i></span>\r\n                                            <span>"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</span>\r\n                                        </button>\r\n                                    </div>\r\n";
},"148":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(149, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"149":function(container,depth0,helpers,partials,data) {
    return "                                        <li>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.label : depth0), depth0))
    + "</li>\r\n";
},"151":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								<div class=\"form-group iad-form-group\">\r\n									<div style=\"text-align:right\">\r\n										<button id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"btn btn-sm btn-default iad-control-add-pyramid-line iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Add a new line\"><i class=\"fa fa-fw fa-plus\"></i>&nbsp;&nbsp;New Line</button>\r\n									</div>\r\n								</div>\r\n";
},"153":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "								<div class=\"well well-sm\">\r\n									<div class=\"form-group iad-form-group\">\r\n										<div style=\"text-align:right\">\r\n											<button id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"button\" class=\"close iad-control-remove-pyramid-line iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Remove\">&times;</button>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Data to be associated with the target\">Data</span>\r\n										</div>\r\n										<div>\r\n											<select id=\""
    + alias4(((helper = (helper = helpers["data-id"] || (depth0 != null ? depth0["data-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-select\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0["data-choices"] : depth0),{"name":"each","hash":{},"fn":container.program(113, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "											</select>\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Line label\">Label</span>\r\n										</div>\r\n										<div>\r\n											<input id=\""
    + alias4(((helper = (helper = helpers["label-id"] || (depth0 != null ? depth0["label-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control input-sm iad-control-text\" type=\"text\" value=\""
    + alias4(((helper = (helper = helpers["label-value"] || (depth0 != null ? depth0["label-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label-value","hash":{},"data":data}) : helper)))
    + "\">\r\n										</div>\r\n									</div>\r\n\r\n									<div class=\"form-group iad-form-group\">\r\n										<div class=\"control-label\">\r\n											<span class=\"iad-tooltip-control\" data-toggle=\"tooltip\" title=\"Line colour\">Colour</span>\r\n										</div>\r\n										<div>\r\n											<button id=\""
    + alias4(((helper = (helper = helpers["color-id"] || (depth0 != null ? depth0["color-id"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-sm btn-default iad-control-color-swatch\" type=\"button\" style=\"background-color:"
    + alias4(((helper = (helper = helpers["color-value"] || (depth0 != null ? depth0["color-value"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color-value","hash":{},"data":data}) : helper)))
    + "\">&nbsp;&nbsp;</button>\r\n										</div>\r\n									</div>\r\n								</div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", buffer = 
  "<div class=\"panel-group\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-accordion\">\r\n\r\n";
  stack1 = ((helper = (helper = helpers.forms || (depth0 != null ? depth0.forms : depth0)) != null ? helper : alias2),(options={"name":"forms","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.forms) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n</div>";
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

  return "						<div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\">\r\n							<div class=\"iad-thumbnail-header\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n							<div data-widget-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"thumbnail iad-thumbnail iad-widget-thumbnail\">\r\n								<img src=\"./config/component-icons/"
    + alias4(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\" alt=\"./config/component-icons/"
    + alias4(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\"></img>\r\n								<div class=\"iad-thumbnail-hover-clickable\">\r\n									"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n								</div>\r\n							</div>\r\n						</div>	\r\n";
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