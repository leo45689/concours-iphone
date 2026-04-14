const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// STOCKAGE SIMPLE EN MEMOIRE (tu peux upgrade après)
let participants = [];

// 🔐 CONFIG TELEGRAM
const BOT_TOKEN = "8315488595:AAHCH2sBDKKw9ve2c2-baKtZjlYxFrgAhYM";
const CHAT_ID = 8348938703;

// 📩 ROUTE PARTICIPATION
app.post("/participate", async (req, res) => {
    const { prenom, nom, email, tel } = req.body;

    if (!email) return res.status(400).json({ error: "Email requis" });

    // ❌ ANTI DOUBLE PARTICIPATION
    const exists = participants.find(p => p.email === email);
    if (exists) {
        return res.status(409).json({ error: "Déjà inscrit" });
    }

    const participant = { prenom, nom, email, tel, date: new Date() };
    participants.push(participant);

    // 🤖 ENVOI TELEGRAM
    const message = `🎉 Nouveau participant\n🟢 │ Prénom: ${prenom}\n​🔴 │​ Nom: ${nom}\n​📩 │ ​Email: ${email}\n📲 │​ Tel: ${tel}`;

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message
    });

    res.json({ success: true });
});

// 📊 COMPTEUR
app.get("/count", (req, res) => {
    res.json({ count: participants.length });
});

// 🚀 LANCEMENT
app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});