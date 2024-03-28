import OtpRepo from "./otp.repository.js";
export default class OTPController {
  constructor() {
    this.otpRepo = new OtpRepo();
  }

  async getOtp(req, res) {
    const email = req.body.email;
    try {
      const otp = await this.otpRepo.sendOtp(email);
      return res.status(200).json({ status: "success", OTP: otp });
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(req, res) {
    const otp = req.body.otp;
    const email = req.body.email;
    try {
      const result = await this.otpRepo.verifyOtp(otp, email);
      if (!result) {
        return res
          .status(404)
          .json({ status: false, errors: "Invalid otp or email" });
      }
      return res.status(200).json({ status: "success", message: result });
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(req, res) {
    const password = req.body.password;
    const email = req.body.email;
    try {
      const result = await this.otpRepo.resetPassword(email, password);
      if (!result) {
        return res
          .status(500)
          .json({ status: false, errors: "something went wrong" });
      }
      return res
        .status(200)
        .json({ status: "success", message: "password resetted successfully" });
    } catch (error) {
      console.log(error);
    }
  }
}
