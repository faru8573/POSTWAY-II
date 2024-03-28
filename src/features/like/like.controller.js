import LikeRepo from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepo = new LikeRepo();
  }
  async getLikes(req, res) {
    const itemId = req.params.id;
    try {
      const result = await this.likeRepo.getLikes(itemId);
      return res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async toggleLike(req, res) {
    const itemId = req.params.id;
    const itemType = req.query.type;
    const userId = req.userId;
    console.log(`toggleLike called itemId ${itemId} itemType ${itemType}`);

    try {
      const like = await this.likeRepo.toggleLike(itemId, itemType, userId);

      if (like) {
        return res.status(200).json({ status: "success", msg: "Like added" });
      } else {
        return res.status(200).json({ status: "success", msg: "Like removed" });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
