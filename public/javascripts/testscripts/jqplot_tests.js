$(document).ready(function () {
	 // var plot1 = $.jqplot ('chartdiv', [[3,7,9,1,4,6,8,2,5]]);


		$.jqplot('SchoolAdmin-TeacherStandards',  [[250,311,298,264]], {
			title:'Raw Total Passed Standards',
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
			series:[{label: 'Standards'}],
			axes:{yaxis:{label:'Number of Standards',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		$.jqplot('SchoolAdmin-Studentspassing',  [[98.5,97.4,98.1,97.6,99.2,99.9]], {
			title:'(%) Students Passing',
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
			series:[{color:'#46a546',label: 'Standards'}],
			axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});


		$.jqplot('SchoolAdmin-StudentStandardExsosure',  [[66,56,71,82,69,76]], {
			title:'Raw Total Exsposed Standards',
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
			series:[{label: 'Standards'}],
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		$.jqplot('SchoolAdmin-StandardSpecific',  [[68.6,81,75,63],[68.6+3,81+7,75+16,63+5],[68.6-3,81-7,75-16,63-5]], {
			title:'Standard Sx Passability By Teacher',
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
				{color:'#46a546',label: 'Mean Percentage'},
				{label: '+STD',lineWidth: 1, linePattern: 'dashed',
					markerOptions: { size: 4, style:"x" }
				},
				{label: '-STD',lineWidth: 1, linePattern: 'dashed',
					markerOptions: { size: 4, style:"x" }
				}

			],
			axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'sw'}
			});


	












		$.jqplot('SchoolDistricts-SchoolStandards',  [[1350,800,1500,1135]], {
			title:'Raw Total Passed Standards',
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
			series:[{label: 'Standards'}],
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'School',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});

		$.jqplot('SchoolDistricts-Schoolspassing',  [[98.5,97.1,99.1,99.6,99.2,99.8]], {
			//comment: i can normailze these, or show the total number of students at a school
			title:'Students passing (%)',
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
			series:[{color:'#46a546',label: 'Standards'}],
			axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'School',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});


		$.jqplot('SchoolDistricts-SchoolStandardExsosure',  [[4200,3700,4400,4100]], {
			title:'Raw Exsposure to Standards',
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
			series:[{label: 'Standards'}],
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'School',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});


	$.jqplot('SchoolDistricts-StandardSpecific',  [[71.9,75.1,83.5,66.4],[71.9+7.8,75.1+9.4,83.5+5.8,66.4+8.2],[71.9-7.8,75.1-9.4,83.5-5.8,66.4-8.2]], {
			title:'Standard Sx Passability By School',
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
				{color:'#46a546',label: 'Mean Percentage'},
				{label: '+STD',lineWidth: 1, linePattern: 'dashed',
					markerOptions: { size: 4, style:"x" }
				},
				{label: '-STD',lineWidth: 1, linePattern: 'dashed',
					markerOptions: { size: 4, style:"x" }
				}

			],
			axes:{yaxis:{label:'Percentage',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'School',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'sw'}
			});

























		});//end of docment ready

