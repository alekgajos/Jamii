/*
 *
 * Copyright (C) Jamii Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * Contributors:
 *  -> Mateusz Zajac<matteo.zajac@gmail.com>
 * 
 */

var FriendListGui = function(){
	
	var friends_table;

	this.init = function() {
		this.logic.signal_new_friend.connect(this.new_friend_handler);
		//TODO jakie id dla ul dla friendlisty
		/*friends_table = document.getElementById("");
		//TODO nazwa buttona add_friend
		document.getElementById("").onSubmit = this.show_search_handler;
		//TODO nazwa buttona search_friend
		document.getElementById("").onSubmit = this.search_friend_handler;
*/
	}

	this.new_friend_handler = function (data){
			
		var li = document.createElement('li');
		//TODO czy id ma byc login?!
		li.setAttribute('id', data["login"]); 
	 	li.setAttribute('draggable','true');	
		li.setAttribute('data-id', data["id"]);
		li.setAttribute('ondragstart','drag(event)'); 

		friends_table.appendChild(li);

		var image_entry = "<img draggable=\"false\" src=\"data:image/gif;base64,"+
			 data["avatar"] + "\" />";
	
		//TODO set style in CSS
		var img = '<img src="images/x.png" style="float:right;height:10px;width:10px;"';

		li.value= image_entry + this.fl.getFriendLogin(i) + img;
	}

	this.show_search_handler = function(){

		//TODO show form for searching friendsData
		return false;
	}
	
	this.search_friend_handler = function(){
		//TODO set UNIQUE names for inputs
		var data = {};
		data ["login"] = document.getElementById("login").value;
		data ["first_name"] = document.getElementById("first_name").value;
		data ["last_name"] = document.getElementById("last_name").value;
		data ["email"] = document.getElementById("email").value;
		signal_search_friend.emit(data);
		return false;
	}
	
	this.signal_search_friend = new Signal();
	
}
