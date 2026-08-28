import FooterSettings from "../models/FooterSettings.js";

export const getFooterSettings = async (req, res) => {
  try {
    const settings = await FooterSettings.findOne().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFooterSettings = async (req, res) => {
  try {
    const settings = await FooterSettings.findOneAndUpdate({}, req.body, {
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
