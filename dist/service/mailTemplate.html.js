"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTemplate = void 0;
exports.mailTemplate = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Email</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; margin: 0 !important; font-size: 15px; line-height: 20px;">
    <table cellspacing="0" cellpadding="0" border="0" align="center"
        style="width:600px; padding: 20px; box-shadow: 0 0 5px 0 #ddd; border-top: 5px solid #0e0e0e; border-bottom: 5px solid #0e0e0e; background: #ffffff;">

        <tr class="td_full" style="float: left; width: 100%;">
            <td style="float: left; width: 100%;">
            <td style="text-align:center; float: left; width: 100%;">
                <p style="float:left; width:100%; text-align: center;">
                    <p
                        style="color: #000000; font-size: 16px; float: left; width: 100%; line-height: 30px; text-align: left;">
                        Hi user_name,</p>

                    <span
                        style="float:left; width:100%; text-align: left; font-size: 15px; line-height: 20px; color: #000000;">
                        collection_name


                       <p>comments</p>
                    </span>
                    <br />
                    <!-- <span tyle="float:left; width:100%; text-align: left; font-size: 15px; line-height: 20px; color: #000000;">
                        collection_name
                    </span> -->
                    
                    <br />
                    <br />
                    <span
                        style="float:left; width:100%; text-align: left; font-size: 15px; line-height: 20px; margin: 15px 0;  color: #000000;">

                        Regards,<br/>
                        Alsiraj Development Team

                        https://alsiraj-s3-bucket-testing.s3.ap-south-1.amazonaws.com/userupload/5252021/logo.png
                    </span>

                </p>
            </td>
            </td>
        </tr>


    </table>
</body>

</html>`;
//# sourceMappingURL=mailTemplate.html.js.map