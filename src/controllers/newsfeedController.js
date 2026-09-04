import Newsfeed from "../models/Newsfeed.js";

const NEWSFEED_AUTHOR = "MARS FINANCIAL AND LEGAL CONSULTANCY LIMITED";

export const getAllNewsfeeds = async (req, res) => {
  try {
    const newsfeeds = await Newsfeed.find({ isActive: true })
      .sort({ date: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: newsfeeds,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllNewsfeedsAdmin = async (req, res) => {
  try {
    const newsfeeds = await Newsfeed.find().sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: newsfeeds,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNewsfeedById = async (req, res) => {
  try {
    const newsfeed = await Newsfeed.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: newsfeed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createNewsfeed = async (req, res) => {
  try {
    const caption = String(
      req.body.caption || req.body.content || req.body.title || "",
    ).trim();
    const newsfeed = await Newsfeed.create({
      title: caption,
      content: caption,
      image: req.body.image || "",
      imagePublicId: req.body.imagePublicId || "",
      author: NEWSFEED_AUTHOR,
      date: new Date(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      data: newsfeed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNewsfeed = async (req, res) => {
  try {
    const caption = String(
      req.body.caption || req.body.content || req.body.title || "",
    ).trim();
    const newsfeed = await Newsfeed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (newsfeed) {
      newsfeed.title = caption;
      newsfeed.content = caption;
      newsfeed.author = NEWSFEED_AUTHOR;
      await newsfeed.save();
    }

    return res.status(200).json({
      success: true,
      data: newsfeed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNewsfeed = async (req, res) => {
  try {
    const newsfeed = await Newsfeed.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: newsfeed,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
