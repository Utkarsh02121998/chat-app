const Messages = require("../models/messageModel");

//getting messages
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;//from and to for two user

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });//updated using for time

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,//it showing self messages that user send to another
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

// adding messages
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;//geeting message  and users
    const data = await Messages.create({// creating message
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
