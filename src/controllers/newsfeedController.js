import Newsfeed from "../models/Newsfeed.js";

const NEWSFEED_AUTHOR = "MARS FINANCIAL AND LEGAL CONSULTANCY LIMITED";

const decodeHtml = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const getMetaContent = (html, names) => {
  for (const name of names) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>|<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${name}["'][^>]*>`,
      "i",
    );
    const match = html.match(pattern);
    if (match?.[1] || match?.[2]) return decodeHtml(match[1] || match[2]);
  }
  return "";
};

const normalizeExternalUrl = (value) => {
  try {
    const url = new URL(String(value || "").trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (
      ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname) ||
      /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(url.hostname)
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
};

export const previewNewsLink = async (req, res) => {
  const externalUrl = normalizeExternalUrl(req.body.url);
  if (!externalUrl) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid public http or https URL.",
    });
  }

  try {
    const response = await fetch(externalUrl, {
      headers: { "user-agent": "MARS-FLC-Newsfeed/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return res.status(422).json({
        success: false,
        message: `The news page could not be fetched (${response.status}).`,
      });
    }

    const html = (await response.text()).slice(0, 2_000_000);
    const title =
      getMetaContent(html, ["og:title", "twitter:title"]) ||
      decodeHtml(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "");
    const description = getMetaContent(html, [
      "og:description",
      "twitter:description",
      "description",
    ]);
    const imageValue = getMetaContent(html, ["og:image", "twitter:image"]);
    const image = imageValue ? new URL(imageValue, externalUrl).toString() : "";
    const sourceName =
      getMetaContent(html, ["og:site_name"]) || new URL(externalUrl).hostname;

    if (!title) {
      return res.status(422).json({
        success: false,
        message: "No article title was found on that page.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { title, description, image, sourceName, externalUrl },
    });
  } catch (error) {
    return res.status(422).json({
      success: false,
      message:
        "The news page could not be reached. Check the URL and try again.",
    });
  }
};

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
    const type = req.body.type === "external" ? "external" : "regular";
    const title = String(req.body.title || "").trim();
    const caption = String(req.body.caption || req.body.content || "").trim();
    const externalUrl =
      type === "external" ? normalizeExternalUrl(req.body.externalUrl) : "";
    if (type === "external" && !externalUrl) {
      return res.status(400).json({
        success: false,
        message: "A valid external news URL is required.",
      });
    }
    const newsfeed = await Newsfeed.create({
      type,
      title,
      content: caption,
      image: req.body.image || "",
      imagePublicId: req.body.imagePublicId || "",
      externalUrl,
      sourceName:
        type === "external" ? String(req.body.sourceName || "").trim() : "",
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
    const type = req.body.type === "external" ? "external" : "regular";
    const title = String(req.body.title || "").trim();
    const caption = String(req.body.caption || req.body.content || "").trim();
    const updates = {
      title,
      content: caption,
      author: NEWSFEED_AUTHOR,
      type,
    };
    if (type === "external") {
      const externalUrl = normalizeExternalUrl(req.body.externalUrl);
      if (!externalUrl) {
        return res.status(400).json({
          success: false,
          message: "A valid external news URL is required.",
        });
      }
      updates.externalUrl = externalUrl;
      updates.sourceName = String(req.body.sourceName || "").trim();
    } else {
      updates.externalUrl = "";
      updates.sourceName = "";
    }
    if (req.body.image !== undefined) updates.image = req.body.image;
    if (req.body.imagePublicId !== undefined) {
      updates.imagePublicId = req.body.imagePublicId;
    }
    const newsfeed = await Newsfeed.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

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
