
Meteor.subscribe("allUsers");

Template.body.helpers({
	searchText: function(){
		return Session.get("searchText");
	},
	searchResults: function(){
		return Meteor.users.find({
			$and: [
			{username: { $regex: Session.get("searchText") + ".*", $options: "i"}
			},
			{username: { $ne: Meteor.user().username}
			}]
		});
	}
});

Template.body.events({
	"submit #searchform": function(event){
		Session.set("searchText", event.target.searchbox.value);
		return false;
	}
});

Template.user.events({
	"click #chatWith": function(event){
		Meteor.call("createChatRoom", this);
	}
});

Template.chatRooms.helpers({
	chatRooms: function(){
		return ChatRooms.find({users: { $elemMatch: { username: Meteor.user().username, seeing: true} } });
	}
});

Template.chatRoom.events({
	"submit #chatform": function(event){
		Meteor.call("sendMessage", event.target.hidden_id.value, event.target.chatBox.value)
		event.target.chatBox.value = "";
		return false;
	},
	"click #deleteChatRoom": function(event){
		Meteor.call("hideChatRoom", this._id);
	}
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});
