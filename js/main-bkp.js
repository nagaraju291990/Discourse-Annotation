$(document).ready(function(){
	// $('[data-toggle="tooltip"]').tooltip();
	// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
	.forEach(tooltip => {
	  new bootstrap.Tooltip(tooltip)
	});
	const textElement = document.getElementById('annotations');
	const submitButton = document.getElementById('submit');
	const downloadButton = document.getElementById('download');
	const tooltip = document.getElementById('tooltip');
	const annotationPairsDiv = document.getElementById('annaphora-pairs');
	const line = document.getElementById('line');

	let selectedWords = [];
	let anaphoraPairs = [];

	textElement.addEventListener('mouseup', () => {
		const selection = window.getSelection();
		const selectedText = selection.toString();
		if (selectedText) {
			const range = selection.getRangeAt(0);
			const span = document.createElement('span');
			span.className = 'highlight';
			span.textContent = selectedText;
			range.deleteContents();
			range.insertNode(span);

			selectedWords.push(span);
			span.addEventListener('mouseover', (event) => {
				const relatedWord = selectedWords.find(word => word !== span && word.textContent.trim() === span.textContent.trim());
				if (relatedWord) {
					tooltip.textContent = `Anaphora: "${span.textContent.trim()}" refers to "${relatedWord.textContent.trim()}"`;
					tooltip.style.left = `${event.pageX + 5}px`;
					tooltip.style.top = `${event.pageY + 5}px`;
					tooltip.style.display = 'block';

					// Show connecting line
					const spanRect = span.getBoundingClientRect();
					console.log(spanRect);
					const relatedRect = relatedWord.getBoundingClientRect();
					console.log(relatedRect);
					const lineHeight = Math.abs(spanRect.top - relatedRect.top) + spanRect.height;
					const lineTop = Math.min(spanRect.top, relatedRect.top) + window.scrollY;
					const lineLeft = Math.min(spanRect.left, relatedRect.left) + window.scrollX + spanRect.width / 2;

					line.style.height = `${lineHeight}px`;
					line.style.left = `${lineLeft}px`;
					line.style.top = `${lineTop}px`;
					line.style.display = 'block';
				}
			});
			span.addEventListener('mouseout', () => {
				// tooltip.style.display = 'none';
				// line.style.display = 'none';
			});
		}
	});

	submitButton.addEventListener('click', () => {
		anaphoraPairs = [];
		annotationPairsDiv.innerHTML = ''; // Clear previous annotations
		for (let i = 0; i < selectedWords.length; i += 2) {
			if (selectedWords[i + 1]) {
				const pair = { word1: selectedWords[i].textContent.trim(), word2: selectedWords[i + 1].textContent.trim() };
				anaphoraPairs.push(pair);

				// Display the pairs in the annotations div
				const pairDiv = document.createElement('div');
				pairDiv.className = 'annotation-pair';
				pairDiv.textContent = `Anaphora: "${pair.word1}" refers to "${pair.word2}"`;
				annotationPairsDiv.appendChild(pairDiv);
			}
		}
		console.log('Anaphora pairs:', anaphoraPairs);
	});

	downloadButton.addEventListener('click', () => {
		const text = textElement.innerText;
		let annotationsText = 'Text:\n' + text + '\n\nAnnotations:\n';
		anaphoraPairs.forEach(pair => {
			annotationsText += `Anaphora: "${pair.word1}" refers to "${pair.word2}"\n`;
		});

		const blob = new Blob([annotationsText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'annotations.txt';
		a.click();
		URL.revokeObjectURL(url);
	});
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
	for(p=0;p<paras.length;p++){
		xml_text += '<paragraph>';
		var words = paras[p].split(" ");
		for(w=0;w<words.length;w++){
			xml_text += '<word> ' + words[w] + ' </word> ' 
		}
		xml_text += '</paragraph>\n';
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
	