function submitFile()
{
	let input = document.getElementById("fileBox").files[0];
	let reader = new FileReader();
	reader.readAsText(input);
	reader.onload = () => {
		parseScript(reader.result);
	}
}

async function parseScript(ts) {
	let div = document.getElementById(`ygScript`);
	div.innerHTML = ``;
	let obj = ts.split(/\[\[(.*?)\]\]/gi);
	for (let i = 0; i < obj.length; ++i)
		if (obj[i][0] == '^') div.innerHTML += `<sup>${obj[i].slice(1)}</sup>`;
		else if (i % 2 == 0) div.innerHTML += obj[i];
		else appendCard(div, obj[i], i);
}

function appendCard(obj, cardName, index)
{
	let imgDiv = document.createElement(`div`);
	let img = document.createElement(`img`);
	imgDiv.appendChild(img);
	imgDiv.classList.add(`tooltipimage`);

	let textDiv = document.createElement(`div`);
	textDiv.classList.add(`tooltiptext`);
	
	let tooltip = document.createElement(`div`);
	tooltip.classList.add('tooltipcontainer');
	tooltip.appendChild(imgDiv);
	tooltip.appendChild(textDiv);
	tooltip.id = cardName + index;

	let link = document.createElement(`a`);
	link.href = `https://yugipedia.com/wiki/` + cardName.replace(/ /g, "_");
	link.innerHTML = cardName;
	link.target = `_blank`;
	link.classList.add(`tooltip`);
	link.appendChild(tooltip);
	
	obj.appendChild(link);
	getImageUrl(tooltip.id, cardName);
}

function getImageUrl(objId, cardName)
{
	let url = "https://yugipedia.com/wiki/" + cardName.replace(/ /g, "_");
	console.log("Accessing " + url);
	const http = new XMLHttpRequest();
	http.open("GET", url);
	http.send();

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			let tooltip = document.getElementById(objId).getElementsByTagName(`div`);
			tooltip[0].getElementsByTagName(`img`)[0].src = getCardUrl(http.responseText);
		}
	}
}

function getCardUrl(doc) {
	let n = doc.indexOf('src="', doc.indexOf("img", doc.indexOf("cardtable-main_image-wrapper") + 1) + 1);
	let m = doc.indexOf('"', n + 5);
	console.log(doc.substring(n + 5, m));
	return doc.substring(n + 5, m);
}