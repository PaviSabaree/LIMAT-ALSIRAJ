import * as nodemailer from 'nodemailer';

class EmailService {
  public  async sendMail(mailOptions) : Promise<string>{
    try {

      console.info(`send email service`)

      let emailResponse = '';
     
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'alsirajmailer@gmail.com',
          pass: 'Alsiraj@mailer2021'
        }
      });

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {

          console.error(`Email failed and the reson is :  ${error.message}`);
          emailResponse = `Email failed and the reson is :  ${error.message}`;          
        } else {


          console.info(`Email send successfully:  ${info}`);

          console.debug(`Email Content`, mailOptions);

          emailResponse = `Email send successfully:  ${info}`;
        }

        return `Email sent ${info}`;
      });

      return emailResponse;
    }
    catch (error) {
      throw error;
    }
  };

}

export default EmailService;
