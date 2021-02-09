import nodemailer from "nodemailer";

export async function sendEmail(to: string,html: string) {
//   let testAccount = await nodemailer.createTestAccount();
//   console.log('testAccount', testAccount)

  console.log('b');

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER_NAME, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
    }
  });

  console.log('c');

  // send mail with defined transport object

  // let message = {
  //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //   to, // list of receivers
  //   subject: "Change password", // Subject line
  //   html, 
  // };
  
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject: "Change password", // Subject line
    html,
  });

  console.log(info);

  console.log('d');

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  console.log('e');
}
