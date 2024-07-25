import nodemailer from "nodemailer";

export const sendOTPMail = async ({ email, subject, otp }) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      secure: true,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject,
      html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
        <title>OrentageProperties</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            border: 0;
          }
          body {
            background-color: whitesmoke;
            /* height: 100vh; */
            font-family: "Roboto", sans-serif;
            color: black;
            max-width: 700px;
            /* width: 100%;
            height: 100%; */
            margin: 0 auto;
            padding: 25px 5px;
          }
          .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .g {
            text-align: left;
            font-size: 18px;
            font-weight: bold;
            color: hsl(45, 100%, 51%);
          }
          .gB {
            text-align: left;
            font-size: 18px;
            font-weight: 900px;
            /* text-align: center; */
          }
          .details {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .opt {
            font-size: 20px;
            font-weight: bold;
            color: hsl(45, 100%, 51%);
            text-align: center;
          }
          .desc {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .dText {
            font-size: 18px;
          }
          .closingGreetings {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin-top: 19px;
          }
          .regard {
            text-align: left;
            font-size: 18px;
            font-weight: bold;
          }
          .orentage {
            text-align: left;
            font-size: 18px;
            font-weight: bold;
            color: hsl(45, 100%, 51%);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h4 class="g">Dear Micah</h4>
          <p class="gB">
            Thank you for signing up for OrentageProperties! To complete your
            registration and activate your account, please verify your email address
            with OTP below
          </p>
          <h2 class="opt">${otp}</h2>
    
          <!-- desc -->
          <div class="desc">
            <!-- desc -->
            <p class="dText">
              If you did not create an account with OrentageProperties, please
              ignore this email.
            </p>
            <!-- btn -->
            <p class="dText">
              If you did not create an account with OrentageProperties, please For
              any questions or assistance, feel free to contact our support team at
              .
            </p>
            <!-- contact -->
            <p class="dText">Thank you for choosing OrentageProperties!</p>
          </div>
    
          <div class="closingGreetings">
            <h5 class="regard">Best regards</h5>
            <h3 class="orentage">OrentageProperties</h3>
          </div>
        </div>
      </body>
    </html>
  `,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    // You can return  the response if you want to
    return mailResponse;
  } catch (error) {
    console.log(error);
  }
};
