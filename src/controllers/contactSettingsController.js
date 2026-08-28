import ContactSettings from "../models/ContactSettings.js";

export const getContactSettings = async (req, res) => {
  try {
    const settings = await ContactSettings.findOne().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactSettings = async (req, res) => {
  try {
    const settings = await ContactSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
