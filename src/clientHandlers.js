/** 
	Function to retreieve data object from object received by a socket
	Could do some additional checking for session ID if necesary.

	@param cargo object received directly by a socket
	@return data object taken from cargo object
*/
var  strip_data_object = function(cargo) {
	var data = cargo["data"];
	return data;
}





/**
   @class
   Constructor of clientHandlers class
   
   @param cm clientManager object to be accesed by the handlers
   @param udb usersDatabase object
*/
var clientHandlers = function(cm, udb){
    this.cm = cm;
    this.udb = udb;
}



clientHandlers.prototype.loginHandler =  function(data, socket){
    
    console.log("Got login data from client");
    var ret = this.cm.user_login(strip_data_object(data));
    if (ret >= 0) { // login OK
	var user_id = ret;
	// start a new session after successful login
	var session_id = this.cm.start_client_session(socket);
	console.info("Assigning session ID: " + session_id + "to user ID: " + user_id);
//	clients_register(socket.id);
	socket.emit("loginOK", {"userID":user_id, "sessionID":session_id});
	this.cm.register_client( user_id, session_id );
//	clients_authenticate(socket.id, user_id);
//	console.log("cliients"	+ clients);
//	console.log("cliients"	+ sessions);
	// TODO: remove 'no such user' warning (brute force attack is now much easier)
    } else if(ret == -1) { // no such user
	socket.emit("loginBAD", {"what":"No such user"});
    } else if(ret == -2) { // login OK
	socket.emit("loginBAD", {"what":"Wrong password"});		
    }
    
}


clientHandlers.prototype.whoAmIHandler = function(packet, socket){
    
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    var user_id = this.cm.get_user_by_session(session_id);
    
    // fix the change of socket for client
    // sessions[session_id] = socket;
    // clients_authenticate(socket.id, user_id);
    
    var user_obj = this.udb.read_user_data(user_id).strip_object() ;
    socket.emit("yourData", user_obj);
    
}


clientHandlers.prototype.registerHandler = function(packet, socket){

    console.info("Got register packet: " + data);
    console.log(data);	
    
    data = strip_data_object( packet );
    
    var User = require("./usersDatabase.js").User;
    var new_user = new User();
    new_user["_email"] = data["email"];
    new_user["_login"] = data["login"];
    new_user["_first_name"] = data["first_name"];
    new_user["_last_name"] = data["last_name"];
    new_user["_password"] = data["passwd"];
    new_user["_registration_date"] = Date.now();
    
    // TODO: validate user data...
    
    try {
	var id = this.udb.register_new_user(new_user);
	console.log("New user successfully registerd with id: " + id.toString());
	socket.emit("registerOK", {'login': new_user['_login']});
    } catch (e) {
	console.log("Unable to register new user: " + e);
    }

}


clientHandlers.prototype.getUserDataFromIdHandler = function(packet, socket){
    
    var data = strip_data_object( packet );
    if (!isNaN(data["id"])) {
	var user_data;
	try {
	    user_data = this.udb.read_user_data(data["id"]);
	    // TODO: strip object
	    var response = user_data.export_to_json();
	    response["id"] = data["id"];
	    socket.emit("userDataFromId", response);
	} catch (e) {} 
    }
    
}

clientHandlers.prototype.searchFriendsHandler = function(packet, socket){
    var data = strip_data_object( packet );
    var results = this.udb.findUsersMultiKey(data);
    socket.emit("matchingUsers", {'list': Object.keys(results)});	
    
}

clientHandlers.prototype.getFriendsDataHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    
    console.log(data);
    
    var response = {};
    response["user_data_list"] = [];
    
    console.info("asked for friends data: " + data["list"]);
    
    var udb_local = this.udb;

    data["list"].forEach(function(id) {
	var user = udb_local.read_user_data(id).strip_object();
	// TODO: control if user exists in database
	// TODO: append status information to the useer object
	response["user_data_list"].push(user);
    });
    
    socket.emit("friendsData", response);
    
}

clientHandlers.prototype.chatHandler = function(packet, socket){
    var session_id = packet.sessionID;
    var data = strip_data_object(packet);
    
    // broadcast
    for(sid in this.cm.sessions) {
	console.log(sid);
        this.cm.sessions[ sid ].emit("chatOK", data);
    }
    
}

module.exports.clientHandlers = clientHandlers;
