"use strict";angular.module("desempregoSuperiorApp",["ngResource","ngRoute","ngSanitize","ui.bootstrap","ui.select"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1,resolve:{parsedData:["d3CSVParser",function(a){return a.loadCSV()}]}}).otherwise({redirectTo:"/"})}]),angular.module("desempregoSuperiorApp").controller("MainCtrl",["$scope","$location","$timeout","parsedData",function(a,b,c,d){function e(b,c){a.$emit("redrawChart",b,c)}a.institutionList,a.parsedData=d,a.urlParams={tipo:"Todos",estabelecimento:null,curso:null},a.$watch(function(){return b.search()},function(b){if(b.estabelecimento){var c=b.estabelecimento;c&&(-1!==a.institutionList.indexOf(c)?(a.setInstitution(c),a.urlParams.estabelecimento=c):alert("Estabelecimento não encontrado. Por favor tente a caixa de pesquisa."))}void 0===b.estabelecimento&&(a.urlParams.tipo="Todos")}),a.$watch("urlParams.tipo",function(c){if(c){var d="Natureza";e(d,c),b.search("estabelecimento",null),a.urlParams.estabelecimento=void 0,a.urlParams.curso=void 0}}),a.setInstitution=function(c){var d="Estabelecimento";e(d,c),b.search("estabelecimento",c),a.urlParams.tipo=void 0,a.urlParams.curso=void 0},a.setCourse=function(c){var d="NomeCurso";e(d,c),b.search("estabelecimento",null),a.urlParams.tipo=void 0,a.urlParams.estabelecimento=void 0}}]),angular.module("desempregoSuperiorApp").directive("d3BubbleChart",["$timeout","$window","d3CSVParser",function(a,b,c){return{restrict:"AE",scope:"=",link:function(c,d){function e(a){a.forEach(function(a,b){a.NumeroDiplomadosCurso=+a.NumeroDiplomadosCurso,a.NumeroDiplomadosDesempregados=+a.NumeroDiplomadosDesempregados,a.TaxaDesempregoRegistadoCurso=parseFloat(a.TaxaDesempregoRegistadoCurso.split(",").join(".")),a.id=b});var b=g.map(a,function(a){return a.Estabelecimento}).keys(),d=g.map(a,function(a){return a.NomeCurso}).keys();c.institutionList=b.sort(),c.courseList=d.sort(),o=a}function f(a,b){var c=g.scale.linear().domain([0,g.max(b,function(a){return a.TaxaDesempregoRegistadoCurso})]).range([0,l]),d=g.scale.linear().domain([0,g.max(b,function(a){return a.NumeroDiplomadosCurso})]).range([m,0]),e=g.mean(b,function(a){return a.TaxaDesempregoRegistadoCurso}).toFixed(2),f=g.svg.axis().scale(c).orient("bottom").innerTickSize(20),h=g.svg.axis().scale(d).orient("left").innerTickSize(20).ticks(10),i=g.scale.sqrt().domain(g.extent(b,function(a){return a.NumeroDiplomadosDesempregados})).range([5,15]),j=g.scale.ordinal().domain(["Privado","Público"]).range(["#ca0020","#0571b0"]);a.append("g").attr("transform","translate(0,"+m+")").attr("class","x axis"),a.append("g").attr("transform","translate(0,0)").attr("class","y axis");var k=a.selectAll("circle.bubble").data(b,function(a){return a.id});k.transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return d(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return j(a.Natureza)}).style("opacity",".7"),k.enter().append("circle").attr("class","bubble").attr("cx",0).attr("cy",m).attr("r",0).style("opacity","0").style("pointer-events","all").transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return d(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return j(a.Natureza)}).style("opacity",".7"),k.exit().transition().duration(750).attr("cx",0).attr("cy",m).attr("r",0).style("opacity","0").remove(),k.sort(function(a,b){return b.NumeroDiplomadosDesempregados>a.NumeroDiplomadosDesempregados}),a.append("line").attr("class","mean").attr({x1:-200,x2:-200,y1:m,y2:0}),a.select("line.mean").transition().delay(850).attr({x1:c(e),x2:c(e),y1:m,y2:0}),a.append("g").attr("class","mean-label").append("text").attr("text-anchor","middle").style("font-size","12px"),a.select("g.mean-label text").transition().delay(850).attr("transform","translate("+c(e)+",-5)").text(""+e+"%"),a.select(".x.axis").transition().duration(500).call(f),a.select(".y.axis").transition().duration(500).call(h),k.on("mouseover",function(){g.select(this).classed("highlight",!0),g.select(this).moveToFront()}).on("mouseout",function(){g.select(this).moveToBack(),p.classed("hidden",!0),g.select(this).classed("highlight",!1)}).on("mousemove",function(a){p.html('<div class="estabelecimento">'+a.Estabelecimento+'</div><div class="curso">'+a.NomeCurso+'</div><div class="estabelecimento">Ensino '+a.Natureza+" | "+a.Grau+'</div><div class="taxa">'+a.TaxaDesempregoRegistadoCurso+'%</div><div class="estabelecimento">Diplomados: '+a.NumeroDiplomadosCurso+'</div><div class="estabelecimento">Diplomados desempregados: '+a.NumeroDiplomadosDesempregados+"</div>").attr("style","top:"+(g.event.pageY-160)+"px;left:"+(g.event.pageX+16)+"px").classed("hidden",!1)})}var g=b.d3;g.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},g.selection.prototype.moveToBack=function(){return this.each(function(){var a=this.parentNode.firstChild;a&&this.parentNode.insertBefore(this,a)})};var h=c.parsedData;e(h),c.$on("redrawChart",function(a,b,c){var d;o&&(d="Todos"===c?o:o.filter(function(a){return a[b]===c}),f(n,d))});var i={top:20,right:80,bottom:50,left:80},j=4/1.2,k=parseInt(g.select(d[0]).style("width")),l=k-i.left-i.right,m=l/j,n=g.select(d[0]).append("svg").attr("width",l+i.left+i.right).attr("height",m+i.top+i.bottom).append("g").attr("transform","translate("+i.left+","+i.top+")");a(function(){n.append("g").append("text").attr("class","x chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate("+(l-10)+","+(m+40)+")").text("Taxa de desemprego (%)"),n.append("g").append("text").attr("class","y chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate(-70, 0) rotate(-90)").text("Número de diplomados")},750);var o,p=g.select(d[0]).append("div").attr("class","custom-tooltip hidden")}}}]),angular.module("desempregoSuperiorApp").factory("d3CSVParser",["$http","$q",function(a,b){var c={},d="desemprego_superior.csv",e=b.defer();return c.loadCSV=function(){return a.get(d,{cache:!0}).then(function(a){e.resolve(d3.csv.parse(a.data))}),e.promise},c}]),angular.module("desempregoSuperiorApp").run(["$templateCache",function(a){a.put("views/main.html",'<div> <div class="row"> <div class="btn-group" style="display: inline-block"> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Público\'">Público</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Privado\'">Privado</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Todos\'">Todos</label> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.estabelecimento" theme="bootstrap" ng-disabled="disabled" on-select="setInstitution($item)"> <ui-select-match placeholder="Procurar instituições">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="institution in institutionList | filter: $select.search"> <div ng-bind-html="institution | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.curso" theme="bootstrap" ng-disabled="disabled" on-select="setCourse($item)"> <ui-select-match placeholder="Procurar cursos">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="course in courseList | filter: $select.search"> <div ng-bind-html="course | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> </div> <h5 style="text-align: center; margin-top: 30px">Taxa de desemprego dos diplomados do ensino superior <span class="publico label">público</span> e <span class="privado label">privado</span>. Os dados dizem respeito aos anos lectivos 2009/2010 a 2012/2013.</h5> <h6 style="text-align: center">Fonte: <a href="http://infocursos.mec.pt/">Ministério da Educação e Ciência</a></h6> <div d3-bubble-chart style="margin-top: 30px"></div> </div>')}]);