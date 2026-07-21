import speakeasy from "speakeasy";
import QRCode from "qrcode";
import userRepository from "../repositories/user.repository";
import { HttpError } from "../error/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

class MfaService {
  /**
   * Generate MFA Secret + QR Code
   */
  async generateMfa(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const secret = speakeasy.generateSecret({
      name: `Secure Library (${user.email})`,
    });

    user.mfaSecret = secret.base32;
    user.mfaEnabled = false;

    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      qrCode,
      secret: secret.base32,
    };
  }

  /**
   * Verify First Setup
   */
  async verifyMfa(userId: string, token: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (!user.mfaSecret) {
      throw new HttpError(
        400,
        "MFA has not been configured."
      );
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      throw new HttpError(
        400,
        "Invalid authentication code."
      );
    }

    user.mfaEnabled = true;

    await user.save();

    return {
      message: "MFA enabled successfully.",
    };
  }

  /**
   * Verify MFA During Login
   */

    /**
   * Disable MFA
   */
  async disableMfa(userId:string){

 const user = await userRepository.findById(userId);


 if(!user){
   throw new HttpError(404,"User not found");
 }


 user.mfaEnabled = false;
 user.mfaSecret = "";


 await user.save();


 return {
   message:"MFA disabled successfully."
 };

}
  async verifyLoginMfa(
    email: string,
    token: string
  ) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new HttpError(
        404,
        "User not found"
      );
    }

    if (!user.mfaEnabled) {
      throw new HttpError(
        400,
        "MFA is not enabled."
      );
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret!,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      throw new HttpError(
        401,
        "Invalid authentication code."
      );
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userData = user.toObject();

delete (userData as any).password;
delete (userData as any).mfaSecret;

    return {
      token: jwtToken,
      user: userData,
    };
  }
}

export default new MfaService();