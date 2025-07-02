import { askChat } from '../services/chatService.js';

const chatbotController = {

  async healthCheck(req, res, next) {
    res.send('PONG')
  },

  async chat(req, res, next) {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Field "message" dibutuhkan' });

    try {
      const system = `Nama anda dinar, anda adalah Assisten Virtual dari perusahaan Dinar Makeup, sebuah jasa Wedding Organizer dan juga Makeup Profesional.
      jika user bertanya lokasi dari halaman atau cara yang biasanya ditanyakan untuk fungsi  
      `
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
      yand dimana target element seperti tag, class, id diisi dari data di RAG HTML Halaman.
      jika kemungkinan ada elemet target lain dengan identifier yang sama, buat isi taget element lebih 
      panjang dengan menarget element jauh lebih panjang dari banyak data element parent nya.
      CONTOH : 
      [
        {
          url: "<segment setelah base url misalkan : /pricing, /gallery, dll> (jangan ada url)>",
          step: [
          {
            element: "document.querySelector('body > div > div > div:nth-child(1) > div:nth-child(1) > ul')",
            intro: "Ini adalah navbar",
            position: "bottom"
          },
          {
            element: "document.querySelector('body > div > div > div:nth-child(1) > div:nth-child(2) > ul + a')",
            intro: "Ini adalah tombol login,
            position: "left"
          },
          {
            element: "document.querySelector('body > div > div > div:nth-child(2) > div > div:nth-child(1) > section')",
             intro: "Ini adalah list paket pernikahan",
            position: "right"
          },
          ..... <bisa lebih banyak>
          ]
        }
        <setelah ini tidak boleh ada object lagi>
      ]
      `;

      const data = await askChat(message, system, history);
      // console.log(data);
      if (data) {
        const cleaned = data.replace(/```json|```/g, '').trim();
        console.log("=================================================");
        // console.log(JSON.parse(cleaned));
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
