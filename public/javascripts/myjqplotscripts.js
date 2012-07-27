$(document).ready(function () {
			var TRbyQuestion =  $.jqplot('TRbyQuestion',  [Correctbyquestion, Incorrectbyquestion] , {
			title:'Results by Question',
			stackSeries: true,
			captureRightClick: true,
			axes:{yaxis:{label:'Result',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Question'}
				},
			seriesDefaults:{
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
			} // pointLabels: {show: true}
			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Incorrect'}],
			legend: {show: true, location: 'se'}
			});
			var plot1 = $.jqplot('TRbyQuestion2',  [Correctbystudent,Incorrectbystudent] , {
			title:'Results by Student',
			stackSeries: true,
			captureRightClick: true,
			seriesDefaults:{
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				}
				// pointLabels: {show: true}
			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Incorrect'}],
			axes:{yaxis:{label:'Result',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Student',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});

			$('#TRbyQuestion2').bind('jqplotDataClick',
				function (ev, seriesIndex, pointIndex, data) {
					var clickedString = 'Student ' + pointIndex + ' ';
					if(seriesIndex == 0){
						clickedString = clickedString + 'correctly answered '+data[1] + ' Questions';
						// $('#info1').html('Correctly Answered '+data[1] + ' Questions');
					}
					else{
						clickedString = clickedString + 'incorrectly answered '+data[1] + ' Questions';
						// $('#info1').html('Inorrectly Answered '+data[1] + ' Questions');
					}
					$('#info1').html(clickedString);
				}
			);


			//for the performancepage
			var plot10 = $.jqplot ('TRbyTests', [[3,7,9,1,4,6,8,2,5]]);
			// var plot2 = $.jqplot('TRbyTests',  [Mean] , {
			// title:'Results by Test',
			// seriesDefaults:{
			// 	renderer:$.jqplot.BarRenderer,
			// 	rendererOptions: {
			// 	// Put a 30 pixel margin between bars.
			// 	barMargin: 30,
			// 	}
			// 	// pointLabels: {show: true}
			// },
			// series:[{color:'#46a546',label: 'Correct'},
			// {color: '#9d261d',label: 'Incorrect'}],
			// axes:{yaxis:{label:'Result',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			// 	xaxis:{label:'Student',renderer: $.jqplot.CategoryAxisRenderer}
			// 	},
			// legend: {show: true, location: 'se'}
			// });





		});//end of docment ready

