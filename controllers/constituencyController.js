const Constituency = require("../models/Constituency");

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
        if (allConstituencies) {
            return res.status(200).json({ message: "punjab constituencies fetched", data: allConstituencies })
        }
        const data = await Constituency.create({ province: 'punjab', constituencies: [] })
        res.status(200).json({ message: 'Punjab constituencies fetched.', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.kpkConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'khyber pakhtunkhwa' });
        if (allConstituencies) {
            return res.status(200).json({ message: "Kpk constituencies fetched", data: allConstituencies })
        }
        const data = await Constituency.create({ province: 'khyber pakhtunkhwa', constituencies: [] })
        res.status(200).json({ message: 'Kpk constituencies fetched.', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.sindhConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'sindh' });
        if (allConstituencies) {
            return res.status(200).json({ message: "sindh constituencies fetched", data: allConstituencies })
        }
        const data = await Constituency.create({ province: 'sindh', constituencies: [] })
        res.status(200).json({ message: 'Sindh constituencies fetched.', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.balochistanConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'balochistan' });
        if (allConstituencies) {
            return res.status(200).json({ message: "balochistan constituencies fetched", data: allConstituencies })
        }
        const data = await Constituency.create({ province: 'balochistan', constituencies: [] })
        res.status(200).json({ message: 'Balochistan constituencies fetched.', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.capitalConstituency = async (req, res) => {
    try {
        const allConstituencies = await Constituency.findOne({ province: 'islamabad capital territory' });
        if (allConstituencies) {
            return res.status(200).json({ message: "capital constituencies fetched", data: allConstituencies })
        }
        const data = await Constituency.create({ province: 'capital', constituencies: [] })
        res.status(200).json({ message: 'Capital constituencies fetched.', data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

exports.addConstituency = async (req, res) => {
    const { constituencyName, area, province } = req.body;

    try {
        // Find the constituency document by province
        let constituenciesDoc = await Constituency.findOne({ province });

        if (constituenciesDoc) {
            // Check for duplicate constituency in the existing province document
            const isDuplicate = constituenciesDoc.constituencies.some(
                (c) => c.constituency === constituencyName
            );

            if (isDuplicate) {
                return res.status(400).json({ message: "Constituency already exists." });
            }

            // Add the new constituency to the existing province document
            constituenciesDoc.constituencies.push({ constituency: constituencyName, area });
            await constituenciesDoc.save();
        } else {
            // If province document doesn't exist, create a new one
            constituenciesDoc = new Constituency({
                province,
                constituencies: [{ constituency: constituencyName, area }],
            });
            await constituenciesDoc.save();
        }

        return res.status(200).json({ message: "Constituency added successfully." });
    } catch (error) {
        console.error("Error adding constituency:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


