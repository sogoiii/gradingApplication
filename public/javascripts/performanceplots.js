$(document).ready(function () {
			var trbstest = $.jqplot('TRbyTests',  [Mean] , {
			title:'Mean Scores',
			seriesDefaults:{
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				}
				// pointLabels: {show: true}
			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Mean Score'}],
			axes:{yaxis:{label:'Mean',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});

			// var initalstd = $('#STD').text();
			// console.log("std intially starts as = " + initalstd); 
			// $('.STD').each(function(index) {
			// 	var now = parseFloat($(this).text()).toFixed(2);
			// 	console.log("std = " + now);
			// 	$(this).text(now);
			// });



		});//end of docment ready

