const Constituency = require("../models/Constituency")

exports.allConstituencies = async (req, res) => {
    try {
        const allConstituencies = await Constituency.find({});
        return res.status(200).json({ message: "all constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.punjabConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'punjab' });
        return res.status(200).json({ message: "punjab constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.kpkConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'khyber pakhtunkhwa' });
        return res.status(200).json({ message: "kpk constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.sindhConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'sindh' });
        return res.status(200).json({ message: "sindh constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.balochistanConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'balochistan' });
        return res.status(200).json({ message: "balochistan constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.capitalConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'capital' });
        return res.status(200).json({ message: "capital constituencies fetched", data: allConstituencies })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.addConstituency = async (req, res) => {
    const targetProvince = req.body;
    const area = req.body;
    const newConstituency = req.body
    try {
        const constituency = await Constituency.findOne({ province: targetProvince });
        if (constituency) {
            constituency.constituencies.push({ constituency: newConstituency, area: area })
            constituency.save();
            return res.status(200).json({ message: 'Constituency added' })
        }
    } catch (error) {
        return res.status(500).message({ error: 'Internal Server Error' })
    }
}