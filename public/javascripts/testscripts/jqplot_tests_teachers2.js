$(document).ready(function () {



	$.jqplot('Teacher-Standard',  [[12,17,5,11],[17,20,13,15]], {
		title:'Standard Performance',
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
			{color:'#46a546',label: 'Passed'},
			{label: 'Instances'}
		],
		axes:{yaxis:{label:'Number of Instances',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			xaxis:{label:'Standard',renderer: $.jqplot.CategoryAxisRenderer}
			},
		legend: {show: true, location: 'se'}
		});


	$.jqplot('Teacher-Standardbypercentage',  [[70.5,85,25,55]], {
		title:'Standards Performance (%)',
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
			{color:'#46a546',label: 'Passed'},
			{label: 'Instances'}
		],
		axes:{yaxis:{label:'Percentage (%)',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			xaxis:{label:'Standard',renderer: $.jqplot.CategoryAxisRenderer}
			},
		legend: {show: true, location: 'se'}
		});
















	$.jqplot('Teacher-TestStandard',  [[18,25,13,11]], {
		title:'Standards in Test',
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
			{label: 'Standards'}
		],
		axes:{yaxis:{label:'Standard Instances',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
			},
		legend: {show: true, location: 'se'}
		});



	$.jqplot('Teacher-TestStandardSpecific',  [[70,45,null,91]], {
		title:'Percentage Standard Sx passed by Teacher Y',
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
			{label: '% Passed'}
		],
		axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
			},
		legend: {show: true, location: 'se'}
		});






	$.jqplot('Teacher-TestScores',  [[100,70,100,50], [87,64,75,41],[87+10,64+5,75+7,41+1], [87-10,64-5,75-7,41-1]],{
		title:'Test Mean Scores',
		// stackSeries: true,
		seriesDefaults:{
			// renderer:$.jqplot.BarRenderer,
			rendererOptions: {
			// Put a 30 pixel margin between bars.
			barMargin: 30,
			// Highlight bars when mouse button pressed.
			// Disables default highlighting on mouse over.
			highlightMouseDown: true
			}
			// pointLabels: {show: true}
		},
		series:[
			{label: 'Total Possible'
			},
			{label: 'Mean',lineWidth: 3, 
				markerOptions: { size: 4, style:"x" }
			},
			{label: '+STD',lineWidth: 1, linePattern: 'dashed', 
				markerOptions: { size: 4, style:"x" }
			},
			{label: '-STD',lineWidth: 1, linePattern: 'dashed', 
				markerOptions: { size: 4, style:"x" }
			}
		],
		axes:{yaxis:{label:'Score',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
			xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
			},
		legend: {show: true, location: 'sw'}
		});


		$.jqplot('Teacher-TestPercentages',  [[87,91.4,75,82], [87+10,91.4+7.1,75+7,82+2],[87-10,91.4-7.1,75-7,82-2] ],{
			title:'Test Percentages',
			// stackSeries: true,
			seriesDefaults:{
				// renderer:$.jqplot.BarRenderer,
				rendererOptions: {
				// Put a 30 pixel margin between bars.
				barMargin: 30,
				// Highlight bars when mouse button pressed.
				// Disables default highlighting on mouse over.
				highlightMouseDown: true
				}
				// pointLabels: {show: true}
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
				xaxis:{label:'Test',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});















});//end of docment ready

