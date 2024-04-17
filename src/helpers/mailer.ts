import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hased tokennpm ru
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            const updatedUser =await User.findByIdAndUpdate
           (userId, {
            $set:{
                verifyToken: hashedToken,
                 verifyTokenExpiry: new Date(Date.now() + 3600000)
            }
        });
        console.log("Updated User for VERIFY",updatedUser);
        } else if (emailType === "RESET"){
          await User.findByIdAndUpdate(userId,{ 
            $set:{
            forgotPasswordToken: hashedToken,
             forgotPasswordTokenExpiry: new Date(Date.now()
              + 3600000)
        }
    });
        }

        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "a4f29bc5e6f070",
            pass: "1b52b86ff2ace6"
          }
        });


        const mailOptions = {
            from: 'hemusin72@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}