$(document).ready(function () {

		$.jqplot('Teacher-Standardsbystudent',  [[30,30,30,30],[25,21,30,29]], {
			title:'Raw Total Standards',
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				},
				pointLabels: {show: true}
			},
			series:[
				{label: 'Exposed Standards'},
				{color:'#46a546',label: 'Passed Standards'},
			],
			axes:{yaxis:{label:'Number of Standards',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Student',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});

		$.jqplot('Teacher-TotalCorrectIncorrectbystudent',  [[13,16,20,19], [7,4,0,1]], {
			title:'Total Correct  & Incorrect',
			// stackSeries: true,
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				},
				pointLabels: {show: true}
			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Incorrect'}],
			axes:{yaxis:{label:'Number of Questions',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Student',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});




		$.jqplot('Teacher-MeanScoresAcrossTests',  [[74,87,92,82], [74+4,87+2,92+8,82+3],[74-4,87-2,92-8,82-3] ],{
			title:'Mean Percentage Across Tests',
			// stackSeries: true,
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				},
				pointLabels: {show: true}
			},
			series:[
				{color:'#46a546',label: 'Mean Score'},
				{label: '+STD',lineWidth: 1, linePattern: 'dashed', 
					markerOptions: { size: 4, style:"x" }
				},
				{label: '-STD',lineWidth: 1, linePattern: 'dashed', 
					markerOptions: { size: 4, style:"x" }
				}
			],
			axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Student',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});





















		$.jqplot('Teacher-TotalCorrectIncorrectbyquestion',  [[18,8,13,2], [2,12,7,18]], {
			title:'Total Correct  & Incorrect',
			// stackSeries: true,
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				},
				pointLabels: {show: true}

			},
			series:[{color:'#46a546',label: 'Correct'},
			{color: '#9d261d',label: 'Incorrect'}],
			axes:{yaxis:{label:'Number of Questions',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Question',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		$.jqplot('Teacher-Scoresbyquestion',  [[4.2,4.8,3.3,3.9], [4.2+.15,4.8+.319,3.3+.318,3.9+.5],[4.2-.15,4.8-.319,3.3-.318,3.9-.5] ],{
			title:'Mean Scores',
			// stackSeries: true,
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				},
				pointLabels: {show: true}
			},
			series:[
				{color:'#46a546',label: 'Mean Score'},
				{label: '+STD',lineWidth: 1, linePattern: 'dashed', 
					markerOptions: { size: 4, style:"x" }
				},
				{label: '-STD',lineWidth: 1, linePattern: 'dashed', 
					markerOptions: { size: 4, style:"x" }
				}
			],
			axes:{yaxis:{label:'Score',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Question',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'sw'}
			});




































});//end of document