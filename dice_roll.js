function b_roll(n) {
	var d_id = "d" + n.toString();
	var p_id = "p" + n.toString();
	console.log(p_id)
	console.log(d_id)
	var dice_num = document.getElementById(d_id).value;
	var rolls = [];
	for (let i=0; i < dice_num; i++) {
		let roll = Math.ceil(Math.random() * 6);
		rolls.push(roll);
	}
	rolls.sort();
	var out_text = "";
	for (r of rolls) {
		let bold = (r == 1 | r == 6) ? true : false;
		if (bold) {out_text += "<b>"};
		out_text += r;
		if (bold) {out_text += "</b>"};
		out_text += "  ";
	}
	document.getElementById(p_id).innerHTML = out_text;
}

function roll1() {
	b_roll(1);
}

function roll2() {
	b_roll(2)
}

function findGetParameter(parameterName) {
	items = window.location.search.substr(1).split('&');
	for (let i = 0; i < items.length; i++) {
		tmp = items[i].split("=");
		if (tmp[0] == parameterName) {
			return decodeURIComponent(tmp[1]);
		}
		return null
	}
}

function setup_rollers() {
	var rolls_url = findGetParameter("rolls");
	if (rolls_url == null) {return};

	var rolls = rolls_url.split("_");
	var roll_div = document.getElementById("dice_rollers");
	for (let r of rolls) {
		let roll_info = get_roll_info(r);
		let name = roll_info.shift();
		let formula = create_roll_name(...roll_info);

		if (name == "") {name = formula};

		console.log("ROLL", name, roll_info);

		let btn = document.createElement("input");
		btn.type = "button";
		btn.value = name;
		btn.title = formula;
		btn.style = "margin-right: 10px;";
		let output = document.createElement("p");
		output.style = "display: inline;";
		btn.onclick = function() {output.innerHTML = roll(...roll_info);}
		roll_div.appendChild(btn);
		roll_div.appendChild(output);
		roll_div.appendChild(document.createElement("br"));
	}

	roll_div.appendChild(document.createElement("br"));
	var clear_btn = document.createElement("input");
	clear_btn.type = "button";
	clear_btn.style = "color: red;";
	clear_btn.value = "Clear Rolls";
	clear_btn.onclick = clear_rolls;
	roll_div.appendChild(clear_btn);
}

function clear_rolls() {
	var roll_div = document.getElementById("dice_rollers");
	var outputs = roll_div.getElementsByTagName("p");
	for (let p of outputs) {
		p.innerHTML = "";
	}
}

function get_roll_info(roll_id) {
	var myRegex = /([\w\s\d']*)\(?(\d+)d(\d+)\*(-?\d+)\+(-?\d+)/g;
	var m = myRegex.exec(roll_id)
	return [m[1], m[2], m[3], m[4], m[5]]
}

function create_roll_name(dice, sides, multiplier, flat) {
	return `(${dice}d${sides} * ${multiplier}) + ${flat}`;
}

function roll(dice, sides, multiplier, flat) {
	console.log(dice, sides, multiplier, flat);
	var rolls = [];
	for (let i = 0; i < dice; i++) {
		rolls.push(Math.ceil(Math.random() * sides));
	}
	return rolls.reduce(function(a,b){return a+b});
}

function add_dice() {
	var name = document.getElementById("input_name").value;
	var sides = document.getElementById("input_num_sides").value;
	var num_dice = document.getElementById("input_num_dice").value;
	var multiplier = document.getElementById("input_multiplier").value;
	var flat_add = document.getElementById("input_add_flat").value;
	var dice_text = `${num_dice}d${sides}*${multiplier}+${flat_add}`;

	var new_button = document.createElement("input");
	new_button.type = "button";
	new_button.value = `${name}(${dice_text})`;
	new_button.onclick = function(event) {remove_on_click(event)};
	document.getElementById("dice_buttons").appendChild(new_button);
}

function remove_on_click(event) {
	console.log("HERE");
	var element = event.target;
	element.remove();
}

function reload_page() {
	var roll_ids = "";
	var roll_button_div = document.getElementById("dice_buttons");
	var roll_buttons = roll_button_div.getElementsByTagName("input");
	for (let btn of roll_buttons) {
		roll_ids += btn.value + "_";
	}

	if (roll_ids.length > 1) {
		roll_ids = roll_ids.substring(0, roll_ids.length - 1);
	}

	var origin = window.location.origin;
	var pathname = window.location.pathname;
	var key = encodeURIComponent("rolls");
	var url_params = encodeURIComponent(roll_ids);
	var new_uri = origin + pathname + "?" + key + "=" + url_params;
	window.location.replace(new_uri);
}