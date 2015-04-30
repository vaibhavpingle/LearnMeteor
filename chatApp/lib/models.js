
ChatRooms = new Mongo.Collection("ChatRooms");

Meteor.methods({
	createChatRoom: function(withUser){
		var checkChatRoom = ChatRooms.findOne(
			{ users: { $all: [{"$elemMatch":{username: Meteor.user().username}}, {"$elemMatch":{username: withUser.username}}]}
		});
		if(checkChatRoom){
			ChatRooms.update({_id: checkChatRoom._id, "users.username": Meteor.user().username}, {$set: {"users.$.seeing": true}});
		}
		else{
			ChatRooms.insert({
			createdAt: new Date(),
			users: [{username: Meteor.user().username, seeing: true}, {username: withUser.username, seeing: false}],
			messages: [{createdAt: new Date(), from: "Admin", messageText:"A New chat room is created."}]});
		}
	},
	sendMessage: function(chatRoomId, messageText){
		ChatRooms.update(
			{_id: chatRoomId}, {
			$push: {
				messages: {
					createdAt: new Date(),
					from: Meteor.user().username,
					messageText: messageText
				}
			}
		});
		ChatRooms.update({_id: chatRoomId, "users.seeing": false}, {$set: {"users.$.seeing": true}});
	},
	hideChatRoom: function(chatRoomId){
		ChatRooms.update({_id: chatRoomId, "users.username": Meteor.user().username}, {$set: {"users.$.seeing": false}});
	}
});