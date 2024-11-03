const ProvincialConstituency = require("../models/ProvincialConstituency")


exports.allProvincialConstituencies = async (req, res) => {
    const allConstituencies = await ProvincialConstituency.find({});
    try {
        if (allConstituencies) {
            return res.status(200).json({ message: 'All Provincial Constituencies fetched', allConstituencies })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.kpkProvincialConstituencies = async (req, res) => {
    const constituencies = await ProvincialConstituency.findOne({ province: 'Khyber Pakhtunkhwa' });

    try {
        if (constituencies) {
            return res.status(200).json({ message: "Kpk provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.punjabProvincialConstituencies = async (req, res) => {
    const constituencies = await ProvincialConstituency.findOne({ province: 'Punjab' });

    try {
        if (constituencies) {
            return res.status(200).json({ message: "Punjab provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.sindhProvincialConstituencies = async (req, res) => {
    const constituencies = await ProvincialConstituency.findOne({ province: 'Sindh' });

    try {
        if (constituencies) {
            return res.status(200).json({ message: "Sindh provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.balochistanProvincialConstituencies = async (req, res) => {
    const constituencies = await ProvincialConstituency.findOne({ province: 'Balochistan' });

    try {
        if (constituencies) {
            return res.status(200).json({ message: "Balochistan provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

