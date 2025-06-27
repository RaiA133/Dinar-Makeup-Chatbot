import { askChat } from '../services/chatService.js';

const chatbotController = {
  async index(req, res, next) {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Field "message" dibutuhkan' });
  
    try {
      const data = await askChat(message);
      if (data) {
        res.status(200).json({
          status: 200,
          message: "Success!",
          data
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error
      })
    }
  },
  async healthCheck(req, res, next) {
    res.send('PONG')
  }
}

export default chatbotController