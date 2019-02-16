"use strict";angular.module("desempregoSuperiorApp",["ngResource","ngRoute","ngSanitize","ui.bootstrap","ui.select"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1,resolve:{parsedData:["d3CSVParser",function(a){return a.loadCSV()}]}}).otherwise({redirectTo:"/"})}]),angular.module("desempregoSuperiorApp").controller("MainCtrl",["$scope","$location","$timeout","parsedData",function(a,b,c,d){function e(b,c,d){a.$emit("redrawChart",b,c,d)}a.institutionList,a.parsedData=d,a.isCollapsed=!0,a.keyValueToFilter={key:"Natureza",value:"Todos"},a.urlParams={tipo:"Todos",estabelecimento:null,curso:null},a.selectOptions=[{name:"Desemprego",key:"TaxaDesempregoRegistadoCurso",labelText:"Taxa de desemprego (%)"},{name:"Diplomados",key:"NumeroDiplomadosCurso",labelText:"Número de diplomados"},{name:"Diplomados desempregados",key:"NumeroDiplomadosDesempregados",labelText:"Número de diplomados desempregados"}],a.selectedOption={xAxis:a.selectOptions[0],yAxis:a.selectOptions[1],circleArea:a.selectOptions[2]},a.$watch("keyValueToFilter",function(b){e(b.key,b.value,a.selectedOption)},!0),a.$watch("selectedOption",function(b){e(a.keyValueToFilter.key,a.keyValueToFilter.value,b)},!0),a.$watch(function(){return b.search()},function(b){if(b.estabelecimento){var c=b.estabelecimento;c&&(-1!==a.institutionList.indexOf(c)?(a.setInstitution(c),a.urlParams.estabelecimento=c):alert("Estabelecimento não encontrado. Por favor tente a caixa de pesquisa."))}void 0===b.estabelecimento&&(a.urlParams.tipo="Todos")}),a.$watch("urlParams.tipo",function(c){c&&(a.keyValueToFilter.key="Natureza",a.keyValueToFilter.value=c,b.search("estabelecimento",null),a.urlParams.estabelecimento=void 0,a.urlParams.curso=void 0)}),a.setInstitution=function(c){a.keyValueToFilter.key="Estabelecimento",a.keyValueToFilter.value=c,b.search("estabelecimento",c),a.urlParams.tipo=void 0,a.urlParams.curso=void 0},a.setCourse=function(c){a.keyValueToFilter.key="NomeCurso",a.keyValueToFilter.value=c,b.search("estabelecimento",null),a.urlParams.tipo=void 0,a.urlParams.estabelecimento=void 0}}]),angular.module("desempregoSuperiorApp").directive("d3BubbleChart",["$timeout","$window","d3CSVParser",function(a,b,c){return{restrict:"AE",scope:"=",link:function(a,c){function d(b){b.forEach(function(a,b){a.NumeroDiplomadosCurso=+a.NumeroDiplomadosCurso,a.NumeroDiplomadosDesempregados=+a.NumeroDiplomadosDesempregados,a.TaxaDesempregoRegistadoCurso=parseFloat(a.TaxaDesempregoRegistadoCurso.split(",").join(".")),a.id=b});var c=f.map(b,function(a){return a.Estabelecimento}).keys(),d=f.map(b,function(a){return a.NomeCurso}).keys();a.institutionList=c.sort(),a.courseList=d.sort(),n=b}function e(a,b,c){var d=c.xAxis.key,e=c.yAxis.key,g=c.circleArea.key;b.sort(function(a,b){return b[g]>a[g]}),f.select(".x.chart-label").text(c.xAxis.labelText),f.select(".y.chart-label").text(c.yAxis.labelText);var h=f.scale.linear().domain([0,f.max(b,function(a){return a[d]})]).range([0,k]),i=f.scale.linear().domain([0,f.max(b,function(a){return a[e]})]).range([l,0]),j=f.mean(b,function(a){return a[d]}).toFixed(2),m=f.mean(b,function(a){return a[e]}).toFixed(2),n=f.svg.axis().scale(h).orient("bottom").innerTickSize(20),p=f.svg.axis().scale(i).orient("left").innerTickSize(20).ticks(10),q=f.scale.sqrt().domain(f.extent(b,function(a){return a[g]})).range([5,15]),r=f.scale.ordinal().domain(["Privado","Público"]).range(["#ca0020","#0571b0"]);a.append("g").attr("transform","translate(0,"+l+")").attr("class","x axis"),a.append("g").attr("transform","translate(0,0)").attr("class","y axis");var s=a.selectAll("circle.bubble").data(b,function(a){return a.id});if(s.transition().duration(750).attr("cx",function(a){return h(a[d])}).attr("cy",function(a){return i(a[e])}).attr("r",function(a){return q(a[g])}).style("fill",function(a){return r(a.Natureza)}).style("opacity",".7"),s.enter().append("circle").attr("class","bubble").attr("cx",0).attr("cy",l).attr("r",0).style("opacity","0").style("pointer-events","all").transition().duration(750).attr("cx",function(a){return h(a[d])}).attr("cy",function(a){return i(a[e])}).attr("r",function(a){return q(a[g])}).style("fill",function(a){return r(a.Natureza)}).style("opacity",".7"),s.exit().transition().duration(750).attr("cx",0).attr("cy",l).attr("r",0).style("opacity","0").remove(),b.length>1){var t=a.selectAll("line.mean.unemployment").data([j]);t.enter().append("line").attr("class","mean unemployment").attr({x1:-200,x2:-200,y1:l,y2:0});var u=a.selectAll("line.mean.students").data([m]);u.enter().append("line").attr("class","mean students").attr({x1:0,x2:k,y1:-200,y2:-200}),u.moveToFront().transition().delay(850).attr({x1:0,x2:k,y1:function(a){return i(a)},y2:function(a){return i(a)}}),t.moveToFront().transition().delay(850).attr({x1:function(a){return h(a)},x2:function(a){return h(a)},y1:l,y2:0}),a.append("g").attr("class","mean-label").append("text").attr("text-anchor","middle").style("font-size","12px"),a.select("g.mean-label text").transition().delay(850).attr("transform","translate("+h(j)+",-5)").text(""+j),a.append("g").attr("class","mean-students-label").append("text").attr("text-anchor","middle").style("font-size","12px"),a.select("g.mean-students-label text").transition().delay(850).attr("transform","translate("+k+","+(i(m)-5)+")").text(""+m)}else a.selectAll("line.mean.students").remove(),a.selectAll("line.mean.unemployment").remove(),a.select("g.mean-students-label").remove(),a.select("g.mean-label").remove();a.select(".x.axis").transition().duration(500).call(n),a.select(".y.axis").transition().duration(500).call(p),s.on("mouseover",function(){f.select(this).classed("highlight",!0),f.select(this).moveToFront()}).on("mouseout",function(){f.select(this).moveToBack(),o.classed("hidden",!0),f.select(this).classed("highlight",!1)}).on("mousemove",function(a){o.html('<div class="estabelecimento">'+a.Estabelecimento+'</div><div class="curso">'+a.NomeCurso+'</div><div class="estabelecimento">Ensino '+a.Natureza+" | "+a.Grau+'</div><div class="taxa">'+a.TaxaDesempregoRegistadoCurso+'%</div><div class="estabelecimento">Diplomados: '+a.NumeroDiplomadosCurso+'</div><div class="estabelecimento">Diplomados desempregados: '+a.NumeroDiplomadosDesempregados+"</div>").attr("style","top:"+(f.event.pageY-160)+"px;left:"+(f.event.pageX+16)+"px").classed("hidden",!1)})}var f=b.d3;f.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},f.selection.prototype.moveToBack=function(){return this.each(function(){var a=this.parentNode.firstChild;a&&this.parentNode.insertBefore(this,a)})};var g=a.parsedData;d(g),a.$on("redrawChart",function(a,b,c,d){var f;n&&(f="Todos"===c?n:n.filter(function(a){return a[b]===c}),e(m,f,d))});var h={top:20,right:80,bottom:50,left:80},i=4/1.2,j=parseInt(f.select(c[0]).style("width")),k=j-h.left-h.right,l=k/i,m=f.select(c[0]).append("svg").attr("width",k+h.left+h.right).attr("height",l+h.top+h.bottom).append("g").attr("class","container").attr("transform","translate("+h.left+","+h.top+")");m.append("g").append("text").attr("class","x chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate("+(k-10)+","+(l-5)+")"),m.append("g").append("text").attr("class","y chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate(-70, 0) rotate(-90)");var n,o=f.select(c[0]).append("div").attr("class","custom-tooltip hidden")}}}]),angular.module("desempregoSuperiorApp").factory("d3CSVParser",["$http","$q",function(a,b){var c={},d="desemprego_superior.csv",e=b.defer();return c.loadCSV=function(){return a.get(d,{cache:!0}).then(function(a){e.resolve(d3.csv.parse(a.data))}),e.promise},c}]),angular.module("desempregoSuperiorApp").run(["$templateCache",function(a){a.put("views/main.html",'<div> <div class="row"> <div class="btn-group" style="display: inline-block"> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Público\'">Público</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Privado\'">Privado</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Todos\'">Todos</label> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.estabelecimento" theme="bootstrap" ng-disabled="disabled" on-select="setInstitution($item)"> <ui-select-match placeholder="Procurar instituições">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="institution in institutionList | filter: $select.search"> <div ng-bind-html="institution | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.curso" theme="bootstrap" ng-disabled="disabled" on-select="setCourse($item)"> <ui-select-match placeholder="Procurar cursos">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="course in courseList | filter: $select.search"> <div ng-bind-html="course | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> <button class="btn btn-default" ng-click="isCollapsed = !isCollapsed"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </button> </div> <div collapse="isCollapsed" style="padding: 10px 0" class="row"> <form class="form-inline"> <div class="form-group"> <label class="control-label">Eixo X</label> <select class="form-control" ng-options="value.name for value in selectOptions" ng-model="selectedOption.xAxis"> </select> </div> <div class="form-group"> <label class="control-label">Eixo Y</label> <select class="form-control" ng-options="value.name for value in selectOptions" ng-model="selectedOption.yAxis"> </select> </div> <div class="form-group"> <label class="control-label">Área círculos</label> <select class="form-control" ng-options="value.name for value in selectOptions" ng-model="selectedOption.circleArea"> </select> </div> </form> </div> <h5 style="text-align: center; margin-top: 30px">Taxa de desemprego dos diplomados do ensino superior <span class="publico label">público</span> e <span class="privado label">privado</span>. Os dados dizem respeito aos anos lectivos 2009/2010 a 2012/2013.</h5> <h6 style="text-align: center">Fonte: <a href="http://infocursos.mec.pt/">Ministério da Educação e Ciência</a></h6> <div d3-bubble-chart style="margin-top: 30px"></div> </div>')}]);