import bcrypt from "bcrypt";

export default class HashingComparingPassword {
  static async hasingPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  static async comparingPassword(password, hasedPassword) {
    const result = await bcrypt.compare(password, hasedPassword);
    return result;
  }
}
