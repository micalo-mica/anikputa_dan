import nodemailer from "nodemailer";

export const sendEmailToken = async ({ email, otp, text, msg }) => {
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
      subject: text,
      html: `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>MacMeal | Account Verification</title>
    <style>
      body {
        background-color: whitesmoke;
        height: 100vh;
        font-family: "Roboto", sans-serif;
        color: #000000;
        position: relative;
        text-align: center;
      }
      .container {
        max-width: 700px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
      .wrapper {
        padding: 0 15px;
      }
      .card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
      .opt {
        color: #ffc107;
        margin-top: 5rem;
      }
      span {
        color: #ffc107;
      }
      button {
        padding: 1em 6em;
        border-radius: 5px;
        border: 0;
        background-color: hsl(45, 100%, 51%);
        transition: all 0.3s ease-in;
        cursor: pointer;
      }
      button:hover {
        background-color: hsl(45, 70%, 51%);
        transition: all 0.3s ease-in;
      }
      .spacing {
        margin-top: 5rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="wrapper">
        <div class="card">
          <h1><span>Welcome OrantageProperties!</span> And thank you for being with us !</h1>
          <p>Please validate your email with the OTP below 👇🏻</p>
          <p class="opt">${otp}</p>
          <p class="spacing"> ${msg}</p>
        </div>
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
