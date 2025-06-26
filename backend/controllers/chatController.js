import Chat from "../models/Chat.js";

export const saveMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const chat = await Chat.create({ sender, receiver, message });
    res.status(201).json(chat);
  } catch (err) {
    console.error("Error saving message:", err.message);
    res.status(500).json({ message: "Message not saved" });
  }
};

export const getMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ message: "Could not fetch chat history" });
  }
};
