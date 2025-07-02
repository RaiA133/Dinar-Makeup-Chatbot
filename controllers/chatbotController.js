import { askChat } from '../services/chatService.js';

const chatbotController = {

  async healthCheck(req, res, next) {
    res.send('PONG')
  },

  async chat(req, res, next) {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Field "message" dibutuhkan' });

    try {
      const system = `Nama anda dinar, anda adalah Assisten Virtual dari perusahaan Dinar Makeup, sebuah jasa Wedding Organizer dan juga Makeup Profesional.`
      const data = await askChat(message, system, history);
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

  async guide(req, res, next) {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Field "message" dibutuhkan' });

    try {
      const system = `berikan saya output JSON berupa isi steps dari setOptions sesuai dengan pertanyaan
      yand dimana target element seperti tag, class, id diisi dari data di RAG HTML Halaman 
      contoh : 
      [
        {
          url: "<link halaman>",
          step: [
          {
            element: document.querySelector(".navbar"),
            intro: "Ini adalah navbar,
            position: "bottom"
          },
          {
            element: document.querySelector(".hero-content"),
             intro: "Ini adalah Hero",
            position: "right"
          },
          {
            element: document.querySelector(".login"),
            intro: "Klik di sini untuk login",
            position: "left"
          },
          .....
          ]
        }
      ]
      `;

      const data = await askChat(message, system, history);
      if (data) {
        const cleaned = data.replace(/```json|```/g, '').trim();
        res.status(200).json({
          status: 200,
          message: "Success!",
          data: JSON.parse(cleaned)
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error
      });
    }
  }


}

export default chatbotController
