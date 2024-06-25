$(document).ready(function(){
	var line = '';
	// $('[data-toggle="tooltip"]').tooltip();
	// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
	.forEach(tooltip => {
	  new bootstrap.Tooltip(tooltip)
	});

	var ta = $("#textarea")[0];
    editor = CodeMirror.fromTextArea(ta, {
        mode: "application/xml",
        lineNumbers: true,
        lineWrapping: true,
        inputStyle: 'contenteditable',
        spellcheck: true,
    });
    editor.setSize(null, 300);

	//checking if saved session exists in browser
	if ("annotations" in localStorage) {
		$("#annotations").html(localStorage.getItem("annotations"));
	}

	const textElement = document.getElementById('annotations');
	const submitButton = document.getElementById('submit');
	const downloadButton = document.getElementById('download');
	const viewButton = document.getElementById('view');
	const viewXMLButton = document.getElementById('viewXML');
	const saveButton = document.getElementById('save');
	const statusDiv = document.getElementById('statusDiv');

	let word1 = '';
	let word2 = '';
	const annotationPairsDiv = document.getElementById('annaphora-pairs');
	// const line = document.getElementById('line');

	let selectedWords = [];
	let anaphoraPairs = [];
	let id1 = '';
	let id2 = '';

	textElement.addEventListener('mouseup', (event) => {
		const selection = window.getSelection();
		const selectedText = selection.toString();
		var id = event.target.id;
		console.log(id);
		if (selectedText) {
			if(word1 != "") {
				id2 = id;
				const range = selection.getRangeAt(0);

				word2 = selectedText;
				// statusDiv.textContent = `Anaphora: "${word1.trim()}" refers to "${word2.trim()}"`;
				// statusDiv.style.left = `${event.pageX + 5}px`;
				// statusDiv.style.top = `${event.pageY + 5}px`;
				// statusDiv.style.display = 'block';

				$("#word2").text(word2);

				// $("#" + id2).html(`<w id="${id2}" coref="TRUE" relid="${id1}"> ${word2} </w>`);

				

			} else {
				id1  = id;
				// selectedWords = [];
				const range = selection.getRangeAt(0);
			
				word1 = selectedText;
				$("#word1").text(word1);
				$("#word2").text('');
				$("#" +id1).addClass("highlight");
			}
		}
	});

	submitButton.addEventListener('click', () => {
		// anaphoraPairs = [];
		annotationPairsDiv.innerHTML = ''; // Clear previous annotations
		let get_relid = $("#" + id2).attr("relid");
		let new_relid = '';
		if(typeof get_relid != "undefined" && get_relid != ""){
			new_relid = get_relid + "," + id1
		} else {
			new_relid = id1;
		}
		$("#" + id2).attr("coref", "TRUE");
		$("#" + id2).attr("relid", new_relid);
		$("#" +id1).html(word1);
		$("#" +id2).html(word2);

		const pair = { word1: word1, word2: word2 };
		anaphoraPairs.push(pair);

		// draw_line(id1, id2);

		word1 = '';
		word2 = '';
		if (window.getSelection().empty) {  // Chrome
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) {  // Firefox
			window.getSelection().removeAllRanges();
		}
		$("#" +id2).addClass("highlight");

		// $(".highlight").remove();
		console.log('Anaphora pairs:', anaphoraPairs);

		$("#"+id1).removeClass("highlight");
		$("#"+id2).removeClass("highlight");
	});

	downloadButton.addEventListener('click', () => {
		const text = textElement.innerText;
		let annotationsText = '';//'Text:\n' + text + '\n\nAnnotations:\n';
		annotationsText += $("#annotations").html();
		// console.log(annotationsText);
		// anaphoraPairs.forEach(pair => {
		// 	annotationsText += `Anaphora: "${pair.word1}" refers to "${pair.word2}"\n`;
		// });

		const blob = new Blob([annotationsText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'annotations.txt';
		a.click();
		URL.revokeObjectURL(url);
	});

	viewXMLButton.addEventListener('click', () => {

		// $("#statusDiv").text( $("#annotations").html());
		editor.getDoc().setValue($("#annotations").html());
	});

	viewButton.addEventListener('click', () => {
		let annotationsText = '<p>Annotations:</p>';
		anaphoraPairs.forEach(pair => {
			annotationsText += `<p>Anaphora: "${pair.word1}" refers to "${pair.word2}"</p>`;
		});
		console.log(annotationsText);
		// $("#annaphora-pairs").hide();
		$("#statusDiv").html(annotationsText);
		word1 = '';
		word2 = '';
		if (window.getSelection().empty) {  // Chrome
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) {  // Firefox
			window.getSelection().removeAllRanges();
		}
		$(".highlight").removeClass("highlight");
		$("#word1").html("");
		$("#word2").html("");
	});
	
	saveButton.addEventListener('click', () => {
		localStorage.setItem("annotations", $("#annotations").html());
	});
	// textElement.addEventListener('scroll', function() {
	// 	console.log("Iam scrolling")
	// 	line.position();
	//   });
});

function startRead(evt) {
	var formData = new FormData();
	formData.append('inputfile', $('#file')[0].files[0]);
	//alert($("#upload
		$.ajax({
			url: "scripts/upload.php",
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (data) {
				console.log(data);	
				data = convert_to_xml(data);
				console.log(data);	
				// editor.getDoc().setValue(data);
				$("#annotations").html(data);
				$("#buttons").show();
			},
			error:function  (jqXHR, exception) {
				$("#loading").hide();
				var msg = '';
				if (jqXHR.status === 0) {
					msg = 'Not connect.\n Verify Network.';
				} else if (jqXHR.status == 404) {
					msg = 'Requested page not found. [404]';
				} else if (jqXHR.status == 500) {
					msg = 'Internal Server Error [500].';
				} else if (exception === 'parsererror') {
					msg = 'Requested JSON parse failed.';
				} else if (exception === 'timeout') {
					msg = 'Time out error.';
				} else if (exception === 'abort') {
					msg = 'Ajax request aborted.';
				} else {
					msg = 'Uncaught Error.\n' + jqXHR.responseText;
				}
				alert("Error in File conversion "+msg);
			}
	
		});
	}

function convert_to_xml(d){
	var paras = d.split("\n");
	var xml_text = '';
	count=1;
	for(p=0;p<paras.length;p++){
		xml_text += '<paragraph><p>';
		var words = paras[p].split(" ");
		for(w=0;w<words.length;w++, count++){
			xml_text += `<word id="${count}"> ${words[w]} </word> `;
		}
		xml_text += '</p></paragraph>\n';
	}
	return xml_text;
}
//called when submit button button is clicked
function submittext(){
	$("#savetype").hide();
	$("#download").hide();
	//$("#result").hide();

	//retrieve values from fields
	// var srctext = $("#input").val();
	var srctext = editor.getValue(); //get text from codemirror input area
	//alert(fromto+" "+srctext);
	
	var lang = $("#lang").val()
	if(typeof srctext =="undefined" || srctext =="") {
		alert("Provide some text...");
		return false;
	}
	if(typeof lang =="undefined" || lang =="") {
		alert("Provide language");
		return false;
	}


	srctext = encodeURIComponent(srctext);
	$("#loading").show();
	$("#result").empty();
	//Ajax call to upload and submit for conversion
	$.ajax({
		type: 'POST',
		url: "scripts/convert.php",
		//data: "&from=" + from + "&to=" + to + "&text=" + srctext,
		data: "&text=" + srctext + "&lang="+lang,
		header:"application/x-www-form-urlencoded",
		async:false,
		success: function (data) {
			$("#loading").hide();
			//alert(data);
			var tgttext = data;
			$("#result").text(tgttext);
			$('#download').prop('disabled', false);
			$('#language').prop('disabled', false);
			$("#savetype").show();
			$("#download").show();
			$("#edit").show();
		
		},
		error:function  (jqXHR, exception) {
			$("#loading").hide();
			var msg = '';
			if (jqXHR.status === 0) {
				msg = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				msg = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				msg = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				msg = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				msg = 'Time out error.';
			} else if (exception === 'abort') {
				msg = 'Ajax request aborted.';
			} else {
				msg = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			alert(msg+" Please try afer sometime");
		}
	});
	return false;
}
	

function draw_line(e1, e2){
	console.log(e1, e2);
	var startElement = document.getElementById(e1);
	var endElement = document.getElementById(e2);

	// New leader line has red color and size 8.
	line = new LeaderLine(startElement, endElement);
	line.setOptions({'path':'arc', 'dash':true});

// 	var pos1 = $("#"+ e1).position();
// 	var pos2 = $("#"+ e2).position();
// 	var line = $("#line");
// 	line
//   .attr('x1', pos1.left)
//   .attr('y1', pos1.top)
//   .attr('x2', pos2.left)
//   .attr('y2', pos2.top);
}