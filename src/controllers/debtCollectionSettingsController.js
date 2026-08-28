import DebtCollectionSettings from "../models/DebtCollectionSettings.js";

export const getDebtCollectionSettings = async (req, res) => {
  try {
    const settings = await DebtCollectionSettings.findOne().sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDebtCollectionSettings = async (req, res) => {
  try {
    const settings = await DebtCollectionSettings.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
