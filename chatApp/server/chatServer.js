
ChatRooms.allow({
	insert: function(){ return true; },
	remove: function(){ return true; },
	update: function(){ return true; }
});

Meteor.publish("allUsers", function(){
	return Meteor.users.find({});
});