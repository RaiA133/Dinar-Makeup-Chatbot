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
      jika user bertanya lokasi dari halaman atau cara yang biasanya ditanyakan untuk fungsi tour guide halaman, jangan beri info data, 
      hanya boleh keterangan letak halaman atau link dengan step step nya.`
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
      yang dimana target element seperti tag, class, id diisi dari data di RAG HTML Halaman.
      jika ada elemet target lain dengan identifier yang sama, buat isi taget element lebih 
      panjang dengan menarget element jauh lebih panjang dari banyak data element parent nya.

      CONTOH : [
        {
          url: "<segment setelah base url misalkan : /pricing, /gallery, dll> (jangan ada url, hanya /<segment>",
          step: [
            {
              element: ".navbar",
              intro: "Ini adalah navbar",
              position: "bottom"
            },
            {              
              element: ".hero-content",
              intro: "Ini adalah Hero",
              position: "right"
            },
            {
              element: ".login",
              intro: "Klik di sini untuk login",
              position: "left"
            },
            ..... <dll>
          ]
        }
        <tidak ada data lagi disini>
      ]

      NOTE : 
      - isi semua element nantinya akan dimasukan kedalam document.querySelector(),
      jadi pastikan element isinya bisa dibacar oleh document.querySelector().
      - url harus sesuaikan dengan semua data url yg ada, jangan beri segment yang tidak ada di semua link halaman webstite

      HASIL JSON DIATAS AKAN DIPAKAI DISINI :
      const resolveSteps = (stepsFromApi) => { // GUNAKAN TARGET ELEMENT UNTUK INTROJS, YG ERROR TIDAK DIGUNAKAN
        return stepsFromApi
          .map(step => {
            try {
              const el = document.querySelector(step.element);
              if (!el) {
                console.warn("Invalid selector or element not found: " + step.element);
                return null;
              }
              return {
                element: el,
                intro: step.intro,
                position: step.position
              };
            } catch (err) {
              console.warn("Skipping invalid selector: " + step.element  + "—" + err.message);
              return null;
            }
          })
          .filter(Boolean); // buang hasil null
      };

      const startTour = useCallback(() => { // INTROJS
        setShowChatbot(false);
        // console.log("introJsSteps", introJsSteps.step);
        // console.log("steps", resolveSteps(introJsSteps.step));
        navigate(introJsSteps.url);
        setTimeout(() => {
          introJs()
            .setOptions({
              steps: resolveSteps(introJsSteps.step),
              nextLabel: "next",
              prevLabel: "back",
              skipLabel: "x",
              doneLabel: "done",
              showProgress: true,
            })
            .start();
        }, 1000);
      }, [introJsSteps]);
      `;

      const data = await askChat(message, system, history);
      console.log(data);
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
