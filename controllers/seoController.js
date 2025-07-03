import { askChat } from '../services/chatService.js';

const seoController = {
  async seo(req, res) {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Parameter "slug" dibutuhkan di query' });
    }

    try {
      const prompt = `Kamu adalah ahli SEO. Buatkan meta title dan meta description untuk halaman dengan slug: "${slug}".
Tampilkan hasil dalam format JSON seperti ini:
{
  "title": "Judul SEO",
  "description": "Deskripsi SEO"
}`;

      const system = `Kamu adalah AI spesialis SEO yang bertugas memberikan metadata halaman untuk keperluan mesin pencari.`
      const data = await askChat(prompt, system);
      console.log(data);

      // Pastikan hasilnya bisa diparse ke JSON
      let seo = {};
      try {
        seo = JSON.parse(data);
      } catch (err) {
        return res.status(500).json({ error: 'Gagal parse hasil Gemini. Pastikan format JSON valid.', raw: data });
      }

      res.status(200).json({
        status: 200,
        message: 'SEO generated successfully',
        data: seo
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        error
      });
    }
  },
};

export default seoController;
