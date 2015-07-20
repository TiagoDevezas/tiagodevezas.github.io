"use strict";angular.module("desempregoSuperiorApp",["ngResource","ngRoute","ngSanitize","ui.bootstrap","ui.select"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1,resolve:{parsedData:["d3CSVParser",function(a){return a.loadCSV()}]}}).otherwise({redirectTo:"/"})}]),angular.module("desempregoSuperiorApp").controller("MainCtrl",["$scope","$location","$timeout","parsedData",function(a,b,c,d){function e(b,c){a.$emit("redrawChart",b,c)}a.institutionList,a.parsedData=d,a.urlParams={tipo:"Todos",estabelecimento:null,curso:null},a.$watch(function(){return b.search()},function(b){if(b.estabelecimento){var c=b.estabelecimento;c&&(-1!==a.institutionList.indexOf(c)?(a.setInstitution(c),a.urlParams.estabelecimento=c):alert("Estabelecimento não encontrado. Por favor tente a caixa de pesquisa."))}void 0===b.estabelecimento&&(a.urlParams.tipo="Todos")}),a.$watch("urlParams.tipo",function(c){if(c){var d="Natureza";e(d,c),b.search("estabelecimento",null),a.urlParams.estabelecimento=void 0,a.urlParams.curso=void 0}}),a.setInstitution=function(c){var d="Estabelecimento";e(d,c),b.search("estabelecimento",c),a.urlParams.tipo=void 0,a.urlParams.curso=void 0},a.setCourse=function(c){var d="NomeCurso";e(d,c),b.search("estabelecimento",null),a.urlParams.tipo=void 0,a.urlParams.estabelecimento=void 0}}]),angular.module("desempregoSuperiorApp").directive("d3BubbleChart",["$timeout","$window","d3CSVParser",function(a,b,c){return{restrict:"AE",scope:"=",link:function(c,d){function e(a){a.forEach(function(a,b){a.NumeroDiplomadosCurso=+a.NumeroDiplomadosCurso,a.NumeroDiplomadosDesempregados=+a.NumeroDiplomadosDesempregados,a.TaxaDesempregoRegistadoCurso=parseFloat(a.TaxaDesempregoRegistadoCurso.split(",").join(".")),a.id=b});var b=g.map(a,function(a){return a.Estabelecimento}).keys(),d=g.map(a,function(a){return a.NomeCurso}).keys();c.institutionList=b.sort(),c.courseList=d.sort(),o=a}function f(a,b){var c=g.scale.linear().domain([0,g.max(b,function(a){return a.TaxaDesempregoRegistadoCurso})]).range([0,l]),e=g.scale.linear().domain([0,g.max(b,function(a){return a.NumeroDiplomadosCurso})]).range([m,0]),f=g.svg.axis().scale(c).orient("bottom").innerTickSize(20),h=g.svg.axis().scale(e).orient("left").innerTickSize(20).ticks(10),i=g.scale.sqrt().domain(g.extent(b,function(a){return a.NumeroDiplomadosDesempregados})).range([5,15]),j=g.scale.ordinal().domain(["Privado","Público"]).range(["#ca0020","#0571b0"]);a.append("g").attr("transform","translate(0,"+m+")").attr("class","x axis"),a.append("g").attr("transform","translate(0,0)").attr("class","y axis");var k=a.selectAll("circle.bubble").data(b,function(a){return a.id});k.transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return e(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return j(a.Natureza)}).style("opacity",".7"),k.enter().append("circle").attr("class","bubble").attr("cx",0).attr("cy",m).attr("r",0).style("opacity","0").transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return e(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return j(a.Natureza)}).style("opacity",".7"),k.exit().transition().duration(750).attr("cx",0).attr("cy",m).attr("r",0).style("opacity","0").remove(),k.sort(function(a,b){return b.NumeroDiplomadosDesempregados>a.NumeroDiplomadosDesempregados}),a.select(".x.axis").transition().duration(500).call(f),a.select(".y.axis").transition().duration(500).call(h);var n=d[0].offsetLeft+100,o=d[0].offsetTop-150;k.on("mouseenter",function(){g.select(this).moveToFront()}).on("mousemove",function(b){var c=g.mouse(a.node()).map(function(a){return parseInt(a)});p.html('<div class="estabelecimento">'+b.Estabelecimento+'</div><div class="curso">'+b.NomeCurso+'</div><div class="estabelecimento">Ensino '+b.Natureza+" | "+b.Grau+'</div><div class="taxa">'+b.TaxaDesempregoRegistadoCurso+'%</div><div class="estabelecimento">Diplomados: '+b.NumeroDiplomadosCurso+'</div><div class="estabelecimento">Diplomados desempregados: '+b.NumeroDiplomadosDesempregados+"</div>").attr("style","left:"+(c[0]+n)+"px;top:"+(c[1]+o)+"px").classed("hidden",!1),g.select(this).classed("highlight",!0)}).on("mouseout",function(){var a=g.select(this);p.classed("hidden",!0),a.classed("highlight",!1),a.moveToBack()})}var g=b.d3;g.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},g.selection.prototype.moveToBack=function(){return this.each(function(){var a=this.parentNode.firstChild;a&&this.parentNode.insertBefore(this,a)})};var h=c.parsedData;e(h),c.$on("redrawChart",function(a,b,c){var d;o&&(d="Todos"===c?o:o.filter(function(a){return a[b]===c}),f(n,d))});var i={top:20,right:80,bottom:50,left:80},j=4/1.2,k=parseInt(g.select(d[0]).style("width")),l=k-i.left-i.right,m=l/j,n=g.select(d[0]).append("svg").attr("width",l+i.left+i.right).attr("height",m+i.top+i.bottom).append("g").attr("transform","translate("+i.left+","+i.top+")");a(function(){n.append("g").append("text").attr("class","x chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate("+(l-10)+","+(m+40)+")").text("Taxa de desemprego (%)"),n.append("g").append("text").attr("class","y chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate(-70, 0) rotate(-90)").text("Número de diplomados")},750);var o,p=g.select(d[0]).append("div").attr("class","custom-tooltip hidden")}}}]),angular.module("desempregoSuperiorApp").factory("d3CSVParser",["$http","$q",function(a,b){var c={},d="desemprego_superior.csv",e=b.defer();return c.loadCSV=function(){return a.get(d,{cache:!0}).then(function(a){e.resolve(d3.csv.parse(a.data))}),e.promise},c}]),angular.module("desempregoSuperiorApp").run(["$templateCache",function(a){a.put("views/main.html",'<div> <div class="row"> <div class="btn-group" style="display: inline-block"> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Público\'">Público</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Privado\'">Privado</label> <label class="btn btn-primary" ng-model="urlParams.tipo" btn-radio="\'Todos\'">Todos</label> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.estabelecimento" theme="bootstrap" ng-disabled="disabled" on-select="setInstitution($item)"> <ui-select-match placeholder="Procurar instituições">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="institution in institutionList | filter: $select.search"> <div ng-bind-html="institution | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="urlParams.curso" theme="bootstrap" ng-disabled="disabled" on-select="setCourse($item)"> <ui-select-match placeholder="Procurar cursos">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="course in courseList | filter: $select.search"> <div ng-bind-html="course | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> </div> <h5 style="text-align: center; margin-top: 30px">Taxa de desemprego dos diplomados do ensino superior <span class="publico">público</span> e <span class="privado">privado</span>. Os dados dizem respeito aos anos lectivos 2009/2010 a 2012/2013.</h5> <h6 style="text-align: center">Fonte: <a href="http://infocursos.mec.pt/">Ministério da Educaçẽo e Ciência</a></h6> <div d3-bubble-chart style="margin-top: 30px"></div> </div>')}]);