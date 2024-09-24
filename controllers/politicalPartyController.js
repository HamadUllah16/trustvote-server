const PoliticalParty = require("../models/PoliticalParty");


exports.createPoliticalParty = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, abbreviation, symbol } = req.body;
        if (id) {
            const exists = await PoliticalParty.findOne({ name });

            if (exists) {
                console.log('political party exists already');
                return res.status(400).json({ message: "Political Party with this name already exists." });
            }

            const newPoliticalParty = new PoliticalParty({
                name: name,
                abbreviation: abbreviation,
                symbol: symbol
            })

            await newPoliticalParty.save();

            console.log('Political Party Created: ', newPoliticalParty)
            res.status(200).json({ message: 'Political Party Created Successfully.', newPoliticalParty })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })

    }
}

exports.allPoliticalParties = async (req, res) => {
    try {
        const allParties = await PoliticalParty.find({}, { createdAt: 0, updatedAt: 0 });
        res.status(200).json({ message: "All political parties fetched", allParties: allParties })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}