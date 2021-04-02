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
	getImageInfo(tooltip.id, cardName);
}

function getImageInfo(objId, cardName)
{
	let url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=" + encodeURIComponent(cardName);
	console.log("Accessing " + url);
	fetch(url)
		.then((resp) => resp.json())
		.then((json) => {
			let card = json.data[0];
			
			let tooltip = document.getElementById(objId).getElementsByTagName(`div`);
			tooltip[0].getElementsByTagName(`img`)[0].src = `https://storage.googleapis.com/ygoprodeck.com/pics_small/${card.id}.jpg`;
			tooltip[1].innerHTML = card.desc;
		})	
}

function getCardUrl(doc) {
	let n = doc.indexOf('src="', doc.indexOf("img", doc.indexOf("cardtable-main_image-wrapper") + 1) + 1);
	let m = doc.indexOf('"', n + 5);
	console.log(doc.substring(n + 5, m));
	return doc.substring(n + 5, m);
}