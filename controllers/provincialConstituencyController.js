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
    const constituencies = await ProvincialConstituency.findOne({ province: 'khyber pakhtunkhwa' });

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
    const { page } = req.body;
    let constituencies;
    try {

        if (page) {
            const limit = 50;
            const skip = (page - 1) * limit;
            constituencies = await ProvincialConstituency.findOne({ province: 'punjab' }).select({
                constituencies: { $slice: [skip, limit] }
            });
            return res.status(200).json({ message: "Punjab provincial constituencies fetched", constituencies });
        }
        constituencies = await ProvincialConstituency.findOne({ province: 'punjab' })
        if (constituencies) {
            return res.status(200).json({ message: "Punjab provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.sindhProvincialConstituencies = async (req, res) => {
    const constituencies = await ProvincialConstituency.findOne({ province: 'sindh' });

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
    const constituencies = await ProvincialConstituency.findOne({ province: 'balochistan' });

    try {
        if (constituencies) {
            return res.status(200).json({ message: "Balochistan provincial constituencies fetched", constituencies });
        }
        return res.status(401).json({ message: 'No constituencies found.' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.addProvincialConstituency = async (req, res) => {
    const { province, constituencyName, area } = req.body;
    try {
        // Find the constituency by province
        const constituencies = await ProvincialConstituency.findOne({ province });

        if (constituencies) {
            // check duplicate
            const duplicateConstituency = constituencies.constituencies.find(
                (c) => c.constituency === constituencyName
            );

            if (duplicateConstituency) {
                return res.status(400).json({ message: "Constituency already exists." });
            }

            // create if no duplicates
            constituencies.constituencies.push({ constituency: constituencyName, area });
            await constituencies.save();
            return res.status(200).json({ message: "Constituency added successfully." });
        } else {

            // if no constituency document exist
            const newConstituency = new ProvincialConstituency({
                province,
                constituencies: [{ constituency: constituencyName, area }],
            });

            await newConstituency.save();
            return res.status(200).json({ message: "Constituency added successfully." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error.", error });
    }


}


