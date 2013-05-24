$(document).ready(function () {
			$.jqplot('TRbyTests',  [Mean] , {
			title:'Mean Scores',
			seriesDefaults:{
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				highlightMouseDown: true
				},
				pointLabels: {show: true}
			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Mean Score'}],
			axes:{yaxis:{label:'Mean',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		});//end of docment ready

