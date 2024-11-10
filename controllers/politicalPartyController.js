const PoliticalParty = require("../models/PoliticalParty");
const { fileUpload } = require("../utils/cloudinary");


exports.createPoliticalParty = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, abbreviation } = req.body;
        if (id) {
            const exists = await PoliticalParty.findOne({ name });


            if (exists) {
                console.log('political party exists already');
                return res.status(400).json({ message: "Political Party with this name already exists." });
            }

            const symbol = await fileUpload(req.files?.symbol[0]?.buffer, 'image');

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

exports.deletePoliticalParty = async (req, res) => {
    const { _id } = req.body;
    console.log(req.body)

    try {
        if (_id) {
            const party = await PoliticalParty.findById(_id);
            if (party) {
                await PoliticalParty.deleteOne({ _id });
                return res.status(200).json({ message: "Political Party deleted." })
            }
            return res.status(401).json({ message: "No political party found." })
        }
        console.error('No id provided.')
        return res.status(401).json({ message: 'No ID Provided.' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error })
    }
}