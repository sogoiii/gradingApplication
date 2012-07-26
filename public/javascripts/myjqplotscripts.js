$(document).ready(function () {	
		// $('#testout').text(Correct);
		// var socket = io.connect();
		var testID = $('#testID').val();
			$.jqplot('TRbyQuestion',  [Correctbyquestion, Incorrectbyquestion] , {
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
				},
				// pointLabels: {show: true}
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
				},
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



		// socket.emit('BuildStats_req',{tesid: testID});
		// socket.on("BuildStats_res", function(stats){
		// 	var somedata = stats;
		// 	var Correct = [];
		// 	var Incorrect = [];
		// 	for(i = 0; i < somedata.length;i++){
		// 		Correct.push([i,somedata[i].CorrectlyAnswered])// CorrectlyAnswered is within the object stats
		// 		Incorrect.push([i,somedata[i].IncorrectlyAnswered])
		// 	}
		// 	$.jqplot('TRbyQuestion',  [Correct, Incorrect] ,
		// 	{title:'Results by Question',
		// 	axes:{yaxis:{label:'Result',ticks: [-0.5,0,1,2,2.5]},
		// 		xaxis:{label:'Question'}
		// 		},
		// 	series:[{color:'#5FAB78',label: 'Correct'},
		// 	{label: 'Incorrect'}],
		// 	legend: {show: true, location: 'se'}
		// 	});
		// }) //- end of socket.on
	


		});//end of docment ready

