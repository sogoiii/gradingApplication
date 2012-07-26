$(document).ready(function () {
	var socket = io.connect();
	socket.on('RPC_response', function(rpcresult){
	$('.ConfirmDone').text(rpcresult);
	$('#Spinner').spin(false);
	});
	socket.on('RPC_Print_response', function(rpcresult){
	$('.CreatedPDFID').text(rpcresult);
	$('.ConfirmDone').text('Click the download file');
	$('a#PDFURL').prop('href', '/pdffile/' + rpcresult);
	$('#CreatePDFSpinner').spin(false);
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
	$('#CreatePDF').on('show', function (event){
		var test = $(this).data('modal').options.testid;
		var user = $(this).data('modal').options.userid;
		$('#CreatePDFSpinner').spin({radius: 9, length: 7,className: 'Spinner'});
		socket.emit('RPC_PrintPDF', {testid: test, userid: user});
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

