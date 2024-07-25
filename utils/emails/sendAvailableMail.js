import nodemailer from "nodemailer";

export const sendAvailableMail = async ({
  email,
  subject,
  user,
  url,
  city,
  state,
  desc,
  price,
}) => {
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
          .detailHeader {
            text-align: left;
            font-size: 20px;
            font-weight: bold;
            /* margin-bottom: 5px; */
            /* color: #30b9b2; */
          }
          .detailLocation {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .d {
            font-size: 16px;
            font-weight: bold;
          }
          .price {
            /* text-align: left; */
            font-size: 20px;
            font-weight: bold;
            color: hsl(45, 100%, 51%);
          }
          .desc {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .dText {
            font-size: 18px;
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
          <h4 class="g">Dear ${user}</h4>
          <p class="gB">
            We hope you're doing well! We are excited to inform you that a property
            matching your preferences has just become available.
          </p>
          <!-- property details -->
          <div class="details">
            <h2 class="detailHeader">Property Detail</h2>
            <div class="detailLocation">
            <p class="d">City: ${city}</p>
            <p class="d">State: ${state}</p>
              <p class="price">Price: ${price}</p>
            </div>
            <!-- Why you will love it  -->
            <div class="desc">
              <!-- desc -->
              <p class="dText">
              ${desc}
              </p>
              <!-- btn -->
              <p class="dText">
                To see more details and photos, please view property. Do not miss
                this opportunity to find your dream home!
              </p>
              <a href="${url}"><button>View property</button></a>
              <!-- contact -->
              <p class="dText">
                If you have any questions or would like to schedule a viewing, feel
                free to contact the owner.
              </p>
            </div>
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
    return mailResponse;
  } catch (error) {
    console.log(error);
  }
};
