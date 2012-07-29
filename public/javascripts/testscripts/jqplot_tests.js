$(document).ready(function () {
	 // var plot1 = $.jqplot ('chartdiv', [[3,7,9,1,4,6,8,2,5]]);


		$.jqplot('SchoolAdmin-TeacherStandards',  [[48,71,65,54]], {
			title:'Total Passed Standards',
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
			axes:{yaxis:{label:'Number of Standards',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		$.jqplot('SchoolAdmin-Studentspassing',  [[98.5,97.4,98.1,97.6,99.2,99.9]], {
			title:'Students Passing (%)',
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
			title:'Total Exsposed Standards',
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
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});



		$.jqplot('SchoolAdmin-StandardSpecific',  [[15,8,21,11,14,19]], {
			title:'Standard XX.xxx Exposure',
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
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'Teacher',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});















		$.jqplot('SchoolDistricts-SchoolStandards',  [[1350,800,1500,1135]], {
			title:'Total Passed Standards',
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


		$.jqplot('SchoolDistricts-SchoolStandardExsosure',  [[66,56,71,82,69,76]], {
			title:'Exsposure to standards',
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
			axes:{yaxis:{label:'Number',labelRenderer: $.jqplot.CanvasAxisLabelRenderer},
				xaxis:{label:'School',renderer: $.jqplot.CategoryAxisRenderer}
				},
			legend: {show: true, location: 'se'}
			});





























		});//end of docment ready

