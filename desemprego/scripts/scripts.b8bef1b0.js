"use strict";angular.module("desempregoSuperiorApp",["ngResource","ngRoute","ngSanitize","ui.bootstrap","ui.select"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("desempregoSuperiorApp").controller("MainCtrl",["$scope",function(a){function b(b,c){a.$emit("redrawChart",b,c)}a.radioModel="Todos",a.$watch("radioModel",function(c){if(c){var d="Natureza";b(d,c),a.selectedInstitution=void 0,a.selectedCourse=void 0}}),a.setInstitution=function(c){var d="Estabelecimento";b(d,c),a.radioModel=void 0,a.selectedCourse=void 0},a.setCourse=function(c){var d="NomeCurso";b(d,c),a.radioModel=void 0,a.selectedInstitution=void 0}}]),angular.module("desempregoSuperiorApp").directive("d3BubbleChart",["$timeout","$window",function(a,b){return{restrict:"AE",scope:"=",link:function(c,d){function e(a,b){var c=f.scale.linear().domain([0,f.max(b,function(a){return a.TaxaDesempregoRegistadoCurso})]).range([0,j]),e=f.scale.linear().domain([0,f.max(b,function(a){return a.NumeroDiplomadosCurso})]).range([k,0]),g=f.svg.axis().scale(c).orient("bottom").innerTickSize(20),h=f.svg.axis().scale(e).orient("left").innerTickSize(20).ticks(10),i=f.scale.sqrt().domain(f.extent(b,function(a){return a.NumeroDiplomadosDesempregados})).range([5,15]),l=f.scale.ordinal().domain(["Privado","Público"]).range(["#ca0020","#0571b0"]);a.append("g").attr("transform","translate(0,"+k+")").attr("class","x axis"),a.append("g").attr("transform","translate(0,0)").attr("class","y axis");var m=a.selectAll("circle.bubble").data(b,function(a){return a.id});m.transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return e(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return l(a.Natureza)}),m.enter().append("circle").attr("class","bubble").attr("cx",0).attr("cy",k).attr("r",0).style("opacity","0").transition().duration(750).attr("cx",function(a){return c(a.TaxaDesempregoRegistadoCurso)}).attr("cy",function(a){return e(a.NumeroDiplomadosCurso)}).attr("r",function(a){return i(a.NumeroDiplomadosDesempregados)}).style("fill",function(a){return l(a.Natureza)}).style("opacity",".7"),m.exit().transition().duration(750).attr("cx",0).attr("cy",k).attr("r",0).style("opacity","0").remove(),m.sort(function(a,b){return b.NumeroDiplomadosDesempregados>a.NumeroDiplomadosDesempregados}),a.select(".x.axis").transition().duration(500).call(g),a.select(".y.axis").transition().duration(500).call(h);var o=d[0].offsetLeft+100,p=d[0].offsetTop;m.on("mouseenter",function(){f.select(this).moveToFront()}).on("mousemove",function(b){var c=f.mouse(a.node()).map(function(a){return parseInt(a)});n.html('<div class="estabelecimento">'+b.Estabelecimento+'</div><div class="curso">'+b.NomeCurso+'</div><div class="estabelecimento">Ensino '+b.Natureza+" | "+b.Grau+'</div><div class="taxa">'+b.TaxaDesempregoRegistadoCurso+"%</div>").attr("style","left:"+(c[0]+o)+"px;top:"+(c[1]+p)+"px").classed("hidden",!1),f.select(this).classed("highlight",!0)}).on("mouseout",function(){var a=f.select(this);n.classed("hidden",!0),a.classed("highlight",!1),a.moveToBack()})}var f=b.d3;f.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})},f.selection.prototype.moveToBack=function(){return this.each(function(){var a=this.parentNode.firstChild;a&&this.parentNode.insertBefore(this,a)})};var g={top:20,right:80,bottom:50,left:80},h=4/1.5,i=parseInt(f.select(d[0]).style("width")),j=i-g.left-g.right,k=j/h,l=f.select(d[0]).append("svg").attr("width",j+g.left+g.right).attr("height",k+g.top+g.bottom).append("g").attr("transform","translate("+g.left+","+g.top+")");a(function(){l.append("g").append("text").attr("class","x chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate("+(j-10)+","+(k+40)+")").text("Taxa de desemprego (%)"),l.append("g").append("text").attr("class","y chart-label").attr("text-anchor","end").style("font-size","12px").attr("transform","translate(-70, 0) rotate(-90)").text("Número de diplomados desempregados")},750);var m,n=f.select(d[0]).append("div").attr("class","custom-tooltip hidden");c.$on("redrawChart",function(a,b,c){var d;m.length&&(d="Todos"===c?m:m.filter(function(a){return a[b]===c}),e(l,d))}),f.csv("desemprego_superior.csv",function(a){a.forEach(function(a,b){a.NumeroDiplomadosCurso=+a.NumeroDiplomadosCurso,a.NumeroDiplomadosDesempregados=+a.NumeroDiplomadosDesempregados,a.TaxaDesempregoRegistadoCurso=parseFloat(a.TaxaDesempregoRegistadoCurso.split(",").join(".")),a.id=b});var b=f.map(a,function(a){return a.Estabelecimento}).keys(),d=f.map(a,function(a){return a.NomeCurso}).keys();c.institutionList=b.sort(),c.courseList=d.sort(),m=a,e(l,a)})}}}]),angular.module("desempregoSuperiorApp").run(["$templateCache",function(a){a.put("views/main.html",'<div> <div class="row"> <div class="btn-group" style="display: inline-block"> <label class="btn btn-primary" ng-model="radioModel" btn-radio="\'Público\'">Público</label> <label class="btn btn-primary" ng-model="radioModel" btn-radio="\'Privado\'">Privado</label> <label class="btn btn-primary" ng-model="radioModel" btn-radio="\'Todos\'">Todos</label> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="$parent.selectedInstitution" theme="bootstrap" ng-disabled="disabled" on-select="setInstitution($item)"> <ui-select-match placeholder="Procurar instituições">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="institution in institutionList | filter: $select.search"> <div ng-bind-html="institution | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> <div style="display: inline-block; width: 30%"> <ui-select ng-model="$parent.selectedCourse" theme="bootstrap" ng-disabled="disabled" on-select="setCourse($item)"> <ui-select-match placeholder="Procurar cursos">{{$select.selected}}</ui-select-match> <ui-select-choices repeat="course in courseList | filter: $select.search"> <div ng-bind-html="course | highlight: $select.search"></div> </ui-select-choices> </ui-select> </div> </div> <h5 style="text-align: center; margin-top: 30px">Taxa de desemprego dos diplomados do ensino superior <span class="publico">público</span> e <span class="privado">privado</span></h5> <div d3-bubble-chart style="margin-top: 30px"></div> </div>')}]);