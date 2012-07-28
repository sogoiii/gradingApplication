$(document).ready(function () {
	var socket = io.connect();
	socket.on('RPC_response_Graded', function(rpcresult){
	$('.gradeComment').empty();
	$('.gradeComment').text(rpcresult);
	$('#Spinner').spin(false);
	});
	socket.on('RPC_Print_response', function(rpcresult){
	$('.createpdfComment').text('File has been created, please open it!');
	$('a#PDFURL').prop('href', '/pdffile/' + rpcresult);
	$('#CreatePDFSpinner').spin(false);
	$('#PDFURL').removeClass('disabled');
	});
	$('#DeleteTest').on('show', function (event) {
		var test = $(this).data('modal').options.testid;
		var user = $(this).data('modal').options.userid;
		$('.confirmdelete').prop('action','/user/' + user + '/testdelete/' + test);
		$('.hiddentest').prop('value', test);
	});
	$('#DeleteClassModal').on('show', function (event) {
		var classid = $(this).data('modal').options.classid;
		var user = $(this).data('modal').options.userid;
		$('.confirmdelete').prop('action','/user/' + user + '/setupclass/');
		$('.hiddentest').prop('value', classid);
	});
	$('#UploadFileModal').on('show', function (event){
		var test = $(this).data('modal').options.testid;
		var user = $(this).data('modal').options.userid;
		$('.UploadFile').prop('action', '/user/' + user + '/tests/upload');
		$('.hiddentest').prop('value', test);
	});
	$('#GradingModal').on('show', function (event){
		var test = $(this).data('modal').options.testid;
		var user = $(this).data('modal').options.userid;
		$('#Spinner').spin({radius: 9, length: 7,className: 'Spinner'});
		socket.emit('RPC_request', {testid: test, userid: user});
	});
	$('#GradingModal').on('hide', function (event){
		$('.gradeComment').empty();
		$('.gradeComment').text('Please wait while the grading is comenced');
	});
	$('#CreatePDF').on('show', function (event){
		$('#CreatePDFSpinner').spin({radius: 9, length: 7,className: 'Spinner'});
		$('#PDFURL').addClass('disabled');
		var test = $(this).data('modal').options.testid;
		var user = $(this).data('modal').options.userid;
		socket.emit('RPC_PrintPDF', {testid: test, userid: user});
	});
	$('#CreatePDF').on('hide', function (event){
		$('.createpdfComment').empty();
		$('.createpdfComment').text('Please wait while the pdf is generated');
	});

	$.fn.spin = function(opts) {
		this.each(function() {
			var $this = $(this);
			data = $this.data();
			if (data.spinner) {
				data.spinner.stop();
				delete data.spinner;
			}
			if (opts !== false) {
				data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
			}
		});
		return this;
	};



	});//end of docment ready

