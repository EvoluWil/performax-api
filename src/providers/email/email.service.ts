import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SendEmailDto } from './dto/send-email.dto';
import { WelcomeEmailDto } from './dto/welcome-email.dto';

@Injectable()
export class EmailService {
  private images = {
    logo: 'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/logo.png?alt=media&token=9481875b-9356-4017-a0d3-e0d88bce2609',
    linkedIn:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/linkedIn.png?alt=media&token=a2cfb525-c4f8-41d7-8b08-9949134f15c2',
    instagram:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/instagram.png?alt=media&token=536998fe-c2ee-4b63-b1e6-32ef42bebb49',
    suporte:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/suporte.png?alt=media&token=e3224891-3ca0-4f60-b155-7cf5a4e51daa',
    wave: 'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/wave.png?alt=media&token=a76ae741-1140-48b4-8627-1d16e6ebb1b9',
    services:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/services.png?alt=media&token=be806a9d-9910-4432-b60f-733618eeccfa',
    welcome:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/welcome.png?alt=media&token=43104e22-b913-4617-9d51-82d298a0721c',
    recovery:
      'https://firebasestorage.googleapis.com/v0/b/controller-2a100.appspot.com/o/recovery.png?alt=media&token=b15b8557-0900-4884-a330-25fc9ecebc91',
  };

  async welcomeEmail(welcomeEmailDto: WelcomeEmailDto) {
    if (!process.env.SENDINBLUE_API_KEY || !process.env.TO_EMAIL) {
      throw new BadRequestException(
        `ERROR SENDING EMAIL VIA SENDGRID: Check your environment variable config`,
      );
    }
    const { name, email, hash } = welcomeEmailDto;
    const url = `${process.env.FIRST_ACCESS_URL}/${hash}`;
    const content = {
      to: [
        {
          email,
          name,
        },
      ],
      sender: {
        email: process.env.TO_EMAIL,
        name: process.env.TO_EMAIL_NAME,
      },
      subject: `Boas vindas ${name}`,
      htmlContent: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <!--[if gte mso 9]>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG />
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <title></title>

            <style type="text/css">
              @media only screen and (min-width: 620px) {
                .u-row {
                  width: 600px !important;
                }
                .u-row .u-col {
                  vertical-align: top;
                }

                .u-row .u-col-49p99 {
                  width: 299.94px !important;
                }

                .u-row .u-col-50 {
                  width: 300px !important;
                }

                .u-row .u-col-50p01 {
                  width: 300.06px !important;
                }

                .u-row .u-col-100 {
                  width: 600px !important;
                }
              }

              @media (max-width: 620px) {
                .u-row-container {
                  max-width: 100% !important;
                  padding-left: 0px !important;
                  padding-right: 0px !important;
                }
                .u-row .u-col {
                  min-width: 320px !important;
                  max-width: 100% !important;
                  display: block !important;
                }
                .u-row {
                  width: 100% !important;
                }
                .u-col {
                  width: 100% !important;
                }
                .u-col > div {
                  margin: 0 auto;
                }
              }
              body {
                margin: 0;
                padding: 0;
              }

              table,
              tr,
              td {
                vertical-align: top;
                border-collapse: collapse;
              }

              p {
                margin: 0;
              }

              .ie-container table,
              .mso-container table {
                table-layout: fixed;
              }

              * {
                line-height: inherit;
              }

              a[x-apple-data-detectors='true'] {
                color: inherit !important;
                text-decoration: none !important;
              }

              table,
              td {
                color: #000000;
              }
              #u_body a {
                color: #0000ee;
                text-decoration: underline;
              }
              @media (max-width: 480px) {
                #u_content_text_4 .v-text-align {
                  text-align: center !important;
                }
                #u_content_text_12 .v-text-align {
                  text-align: left !important;
                }
                #u_content_text_19 .v-text-align {
                  text-align: left !important;
                }
                #u_content_image_10 .v-src-width {
                  width: 100% !important;
                }
                #u_content_image_10 .v-src-max-width {
                  max-width: 100% !important;
                }
                #u_content_text_31 .v-text-align {
                  text-align: center !important;
                }
                #u_content_text_34 .v-text-align {
                  text-align: center !important;
                }
                #u_content_text_29 .v-text-align {
                  text-align: center !important;
                }
              }
            </style>

            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Cabin:400,700&display=swap"
              rel="stylesheet"
              type="text/css"
            />
            <!--<![endif]-->
          </head>

          <body
            class="clean-body u_body"
            style="
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              background-color: #ffffff;
              color: #000000;
            "
          >
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table
              id="u_body"
              style="
                border-collapse: collapse;
                table-layout: fixed;
                border-spacing: 0;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                vertical-align: top;
                min-width: 320px;
                margin: 0 auto;
                background-color: #ffffff;
                width: 100%;
              "
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr style="vertical-align: top">
                  <td
                    style="
                      word-break: break-word;
                      border-collapse: collapse !important;
                      vertical-align: top;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 21px 10px 20px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td
                                              class="v-text-align"
                                              style="
                                                padding-right: 0px;
                                                padding-left: 0px;
                                              "
                                              align="center"
                                            >
                                              <img
                                                align="center"
                                                border="0"
                                                src="${this.images.logo}"
                                                alt="Image"
                                                title="Image"
                                                style="
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                  clear: both;
                                                  display: inline-block !important;
                                                  border: none;
                                                  height: auto;
                                                  float: none;
                                                  width: 29%;
                                                  max-width: 168.2px;
                                                "
                                                width="168.2"
                                                class="v-src-width v-src-max-width"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <!--[if gte mso 9]>
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 600px;">
                <tr>
                  <td background="https://cdn.templates.unlayer.com/assets/1599210179689-vv.png" valign="top" width="100%">
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
                <v:fill type="frame" src="https://cdn.templates.unlayer.com/assets/1599210179689-vv.png" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
              <![endif]-->

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #7e8c8d;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-image: url('${this.images.welcome}');
                            background-repeat: no-repeat;
                            background-position: center top;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-image: url('${this.images.welcome}');background-repeat: no-repeat;background-position: center top;background-color: #7e8c8d;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_text_4"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 23px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #ffffff;
                                            line-height: 150%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="line-height: 150%">
                                            <span style="font-family: Cabin, sans-serif"
                                              ><span
                                                style="
                                                  font-size: 28px;
                                                  line-height: 42px;
                                                "
                                                >Boas vindas ao Controller!</span
                                              ></span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #ffffff;
                                            line-height: 160%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 160%">
                                            Comece a Sua Jornada de Sucesso Conosco!
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 30px 10px 43px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <!--[if mso
                                          ]><style>
                                            .v-button {
                                              background: transparent !important;
                                            }
                                          </style><!
                                        [endif]-->
                                        <div class="v-text-align" align="center">
                                          <!--[if mso]><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" bgcolor="#00d09c" style="padding:12px 30px;" valign="top"><![endif]-->
                                          <a
                                            href="${url}"
                                            target="_blank"
                                            class="v-button"
                                            style="
                                              box-sizing: border-box;
                                              display: inline-block;
                                              text-decoration: none;
                                              -webkit-text-size-adjust: none;
                                              text-align: center;
                                              color: #ffffff;
                                              background-color: #00d09c;
                                              border-radius: 1px;
                                              -webkit-border-radius: 1px;
                                              -moz-border-radius: 1px;
                                              width: auto;
                                              max-width: 100%;
                                              overflow-wrap: break-word;
                                              word-break: break-word;
                                              word-wrap: break-word;
                                              mso-border-alt: none;
                                              font-size: 14px;
                                            "
                                          >
                                            <span
                                              style="
                                                display: block;
                                                padding: 12px 30px;
                                                line-height: 120%;
                                              "
                                              >Primeiro acesso</span
                                            >
                                          </a>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <!--[if gte mso 9]>
              </v:textbox></v:rect>
            </td>
            </tr>
            </table>
            <![endif]-->

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #e4faf4;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e4faf4;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 45px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-family: Cabin, sans-serif;
                                                font-size: 20px;
                                                line-height: 28px;
                                              "
                                              ><strong
                                                >Prezado(a) ${name}</strong
                                              ></span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #4c5763;
                                            line-height: 180%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 180%">
                                            <strong
                                              >É com grande prazer que damos as
                                              boas-vindas à nossa plataforma!</strong
                                            >
                                            Estamos empolgados em tê-lo(a) como parte da
                                            nossa família. Através da nossa plataforma,
                                            você terá acesso a ferramentas e recursos
                                            que irão simplificar a sua experiência
                                            conosco.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 21px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-50"
                            style="
                              max-width: 320px;
                              min-width: 300px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td
                                              class="v-text-align"
                                              style="
                                                padding-right: 0px;
                                                padding-left: 0px;
                                              "
                                              align="center"
                                            >
                                              <img
                                                align="center"
                                                border="0"
                                                src="${this.images.services}"
                                                alt="Image"
                                                title="Image"
                                                style="
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                  clear: both;
                                                  display: inline-block !important;
                                                  border: none;
                                                  height: auto;
                                                  float: none;
                                                  width: 86%;
                                                  max-width: 240.8px;
                                                "
                                                width="240.8"
                                                class="v-src-width v-src-max-width"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-50"
                            style="
                              max-width: 320px;
                              min-width: 300px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_text_12"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-family: Cabin, sans-serif;
                                                font-size: 20px;
                                                line-height: 28px;
                                              "
                                              >Nossos Serviços</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 10px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="left"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="27%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 3px solid #00d09c;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Centralizar os seus dados cadastrais e
                                              documentos importantes </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Acessar recibos de pagamentos mensais
                                              e manter um registro claro das suas
                                              transações. </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Explorar informações relevantes sobre
                                              a empresa, como políticas internas e
                                              benefícios. . </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 15px 10px 10px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <!--[if mso
                                          ]><style>
                                            .v-button {
                                              background: transparent !important;
                                            }
                                          </style><!
                                        [endif]-->
                                        <div class="v-text-align" align="left">
                                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:39px; v-text-anchor:middle; width:150px;" arcsize="2.5%"  stroke="f" fillcolor="#00d09c"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                          <a
                                            href="${url}"
                                            target="_blank"
                                            class="v-button"
                                            style="
                                              box-sizing: border-box;
                                              display: inline-block;
                                              text-decoration: none;
                                              -webkit-text-size-adjust: none;
                                              text-align: center;
                                              color: #ffffff;
                                              background-color: #00d09c;
                                              border-radius: 1px;
                                              -webkit-border-radius: 1px;
                                              -moz-border-radius: 1px;
                                              width: auto;
                                              max-width: 100%;
                                              overflow-wrap: break-word;
                                              word-break: break-word;
                                              word-wrap: break-word;
                                              mso-border-alt: none;
                                              font-size: 14px;
                                            "
                                          >
                                            <span
                                              style="
                                                display: block;
                                                padding: 11px 25px;
                                                line-height: 120%;
                                              "
                                              ><span
                                                style="
                                                  font-size: 14px;
                                                  line-height: 16.8px;
                                                "
                                                >Primeiro acesso</span
                                              ></span
                                            >
                                          </a>
                                          <!--[if mso]></center></v:roundrect><![endif]-->
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 21px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #f6fefb;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f6fefb;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 21px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #f6fefb;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f6fefb;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-50"
                            style="
                              max-width: 320px;
                              min-width: 300px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_text_19"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-family: Cabin, sans-serif;
                                                font-size: 20px;
                                                line-height: 28px;
                                              "
                                              ><strong
                                                >Passo a Passo para Começar</strong
                                              ></span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 10px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="left"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="27%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 3px solid #00d09c;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Acesse à Plataforma</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Cadastre uma nova senha </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Preencha seu Perfil e Dados
                                              Cadastrais </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Adicione os Documentos
                                              requisitados</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 15px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Explore a Plataforma </span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 7px 10px 0px 16px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #596374;
                                            line-height: 140%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                                font-family: arial, helvetica,
                                                  sans-serif;
                                              "
                                              >•  Se tiver qualquer dúvida, fale com o
                                              suporte, estaremos atentos para te
                                              atender</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-50"
                            style="
                              max-width: 320px;
                              min-width: 300px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 15px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td
                                              class="v-text-align"
                                              style="
                                                padding-right: 0px;
                                                padding-left: 0px;
                                              "
                                              align="center"
                                            >
                                              <img
                                                align="center"
                                                border="0"
                                                src="${this.images.suporte}"
                                                alt="Image"
                                                title="Image"
                                                style="
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                  clear: both;
                                                  display: inline-block !important;
                                                  border: none;
                                                  height: auto;
                                                  float: none;
                                                  width: 86%;
                                                  max-width: 240.8px;
                                                "
                                                width="240.8"
                                                class="v-src-width v-src-max-width"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #f6fefb;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f6fefb;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 21px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 20px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 14px;
                                                line-height: 19.6px;
                                              "
                                              ><span
                                                style="
                                                  font-size: 24px;
                                                  line-height: 33.6px;
                                                  font-family: Cabin, sans-serif;
                                                "
                                                ><strong>Sua Jornada Começa Aqui</strong
                                                >.</span
                                              ><br
                                            /></span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 5px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 12px;
                                                line-height: 16.8px;
                                              "
                                              >Estamos entusiasmados por ter você como
                                              parte da nossa equipe. Através da nossa
                                              plataforma, queremos tornar a sua
                                              experiência de integração e gerenciamento
                                              de informações mais eficiente e
                                              conveniente.
                                            </span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_image_10"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td
                                              class="v-text-align"
                                              style="
                                                padding-right: 0px;
                                                padding-left: 0px;
                                              "
                                              align="center"
                                            >
                                              <img
                                                align="center"
                                                border="0"
                                                src="${this.images.wave}"
                                                alt="Image"
                                                title="Image"
                                                style="
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                  clear: both;
                                                  display: inline-block !important;
                                                  border: none;
                                                  height: auto;
                                                  float: none;
                                                  width: 100%;
                                                  max-width: 600px;
                                                "
                                                width="600"
                                                class="v-src-width v-src-max-width"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #d9f7ed;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #bbbbbb;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #d9f7ed;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="299" style="width: 299px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-49p99"
                            style="
                              max-width: 320px;
                              min-width: 299.96px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_text_31"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #00d09c;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-family: Cabin, sans-serif;
                                                font-size: 14px;
                                                line-height: 19.6px;
                                              "
                                              ><span
                                                style="
                                                  font-size: 16px;
                                                  line-height: 22.4px;
                                                "
                                                >Contato</span
                                              ><br
                                            /></span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  id="u_content_text_34"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #4c5763;
                                            line-height: 170%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 170%">
                                            support@domain.com<br />sales@domain.com
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-50p01"
                            style="
                              max-width: 320px;
                              min-width: 300.04px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_text_29"
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            color: #00d09c;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-family: Cabin, sans-serif;
                                                font-size: 16px;
                                                line-height: 22.4px;
                                              "
                                              >Siga-nos<br
                                            /></span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 20px 10px 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div align="center">
                                          <div style="display: table; max-width: 93px">
                                            <!--[if (mso)|(IE)]><table width="93" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:93px;"><tr><![endif]-->

                                            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
                                            <table
                                              align="left"
                                              border="0"
                                              cellspacing="0"
                                              cellpadding="0"
                                              width="32"
                                              height="32"
                                              style="
                                                width: 32px !important;
                                                height: 32px !important;
                                                display: inline-block;
                                                border-collapse: collapse;
                                                table-layout: fixed;
                                                border-spacing: 0;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                vertical-align: top;
                                                margin-right: 15px;
                                              "
                                            >
                                              <tbody>
                                                <tr style="vertical-align: top">
                                                  <td
                                                    align="left"
                                                    valign="middle"
                                                    style="
                                                      word-break: break-word;
                                                      border-collapse: collapse !important;
                                                      vertical-align: top;
                                                    "
                                                  >
                                                    <a
                                                      href="https://instagram.com/"
                                                      title="Instagram"
                                                      target="_blank"
                                                    >
                                                      <img
                                                        src="${this.images.instagram}"
                                                        alt="Instagram"
                                                        title="Instagram"
                                                        width="32"
                                                        style="
                                                          outline: none;
                                                          text-decoration: none;
                                                          -ms-interpolation-mode: bicubic;
                                                          clear: both;
                                                          display: block !important;
                                                          border: none;
                                                          height: auto;
                                                          float: none;
                                                          max-width: 32px !important;
                                                        "
                                                      />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <!--[if (mso)|(IE)]></td><![endif]-->

                                            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                            <table
                                              align="left"
                                              border="0"
                                              cellspacing="0"
                                              cellpadding="0"
                                              width="32"
                                              height="32"
                                              style="
                                                width: 32px !important;
                                                height: 32px !important;
                                                display: inline-block;
                                                border-collapse: collapse;
                                                table-layout: fixed;
                                                border-spacing: 0;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                vertical-align: top;
                                                margin-right: 0px;
                                              "
                                            >
                                              <tbody>
                                                <tr style="vertical-align: top">
                                                  <td
                                                    align="left"
                                                    valign="middle"
                                                    style="
                                                      word-break: break-word;
                                                      border-collapse: collapse !important;
                                                      vertical-align: top;
                                                    "
                                                  >
                                                    <a
                                                      href="https://linkedin.com/"
                                                      title="LinkedIn"
                                                      target="_blank"
                                                    >
                                                      <img
                                                        src="${this.images.linkedIn}"
                                                        alt="LinkedIn"
                                                        title="LinkedIn"
                                                        width="32"
                                                        style="
                                                          outline: none;
                                                          text-decoration: none;
                                                          -ms-interpolation-mode: bicubic;
                                                          clear: both;
                                                          display: block !important;
                                                          border: none;
                                                          height: auto;
                                                          float: none;
                                                          max-width: 32px !important;
                                                        "
                                                      />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <!--[if (mso)|(IE)]></td><![endif]-->

                                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #d9f7ed;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->

                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div style="height: 100%; width: 100% !important">
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: arial, helvetica, sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: arial, helvetica, sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #d9f7ed;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>

                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
          </body>
        </html>
      `,
    };
    try {
      const { data } = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        content,
        {
          headers: { 'api-key': process.env.SENDINBLUE_API_KEY },
        },
      );
      return data;
    } catch (error: any) {
      throw new BadRequestException('Não foi possível enviar o email');
    }
  }

  async forgotPasswordEmail(welcomeEmailDto: WelcomeEmailDto) {
    if (!process.env.SENDINBLUE_API_KEY || !process.env.TO_EMAIL) {
      throw new BadRequestException(
        `ERROR SENDING EMAIL VIA SENDGRID: Check your environment variable config`,
      );
    }
    const { name, email, hash } = welcomeEmailDto;
    const url = `${process.env.RECOVERY_PASSWORD_URL}/${hash}`;
    const content = {
      to: [
        {
          email,
          name,
        },
      ],
      sender: {
        email: process.env.TO_EMAIL,
        name: process.env.TO_EMAIL_NAME,
      },
      subject: `Recuperar senha`,
      htmlContent: `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
          <title></title>
          
            <style type="text/css">
              @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }

          .u-row .u-col-49p99 {
            width: 299.94px !important;
          }

          .u-row .u-col-50p01 {
            width: 300.06px !important;
          }

          .u-row .u-col-100 {
            width: 600px !important;
          }

        }

        @media (max-width: 620px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: 100% !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col > div {
            margin: 0 auto;
          }
        }
        body {
          margin: 0;
          padding: 0;
        }

        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }

        p {
          margin: 0;
        }

        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }

        * {
          line-height: inherit;
        }

        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }

        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_10 .v-src-width { width: 100% !important; } #u_content_image_10 .v-src-max-width { max-width: 100% !important; } #u_content_text_31 .v-text-align { text-align: center !important; } #u_content_text_34 .v-text-align { text-align: center !important; } #u_content_text_29 .v-text-align { text-align: center !important; } }
            </style>
          
          

        <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Cabin:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

        </head>

        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
            
          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:21px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <img align="center" border="0" src="${this.images.logo}" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 168.2px;" width="168.2" class="v-src-width v-src-max-width"/>
              
            </td>
          </tr>
        </table>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <img align="center" border="0" src="${this.images.recovery}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 580px;" width="580" class="v-src-width v-src-max-width"/>
              
            </td>
          </tr>
        </table>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
        <div class="v-text-align" align="center">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:37px; v-text-anchor:middle; width:147px;" arcsize="11%"  stroke="f" fillcolor="#3AAEE0"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
            <a href="${url}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
              <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Recuperar senha</span></span>
            </a>
            <!--[if mso]></center></v:roundrect><![endif]-->
        </div>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div class="v-text-align" style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="line-height: 140%;">Recebemos uma solicitação para redefinir sua senha. Se você não fez esta solicitação, simplesmente ignore este e-mail.</p>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table id="u_content_image_10" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <img align="center" border="0" src="${this.images.wave}" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;" width="600" class="v-src-width v-src-max-width"/>
              
            </td>
          </tr>
        </table>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #d9f7ed;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <span>&#160;</span>
                </td>
              </tr>
            </tbody>
          </table>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #d9f7ed;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="299" style="width: 299px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-49p99" style="max-width: 320px;min-width: 299.96px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table id="u_content_text_31" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div class="v-text-align" style="font-size: 14px; color: #00d09c; line-height: 140%; text-align: center; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"><span style="font-family: Cabin, sans-serif; font-size: 14px; line-height: 19.6px;"><span style="font-size: 16px; line-height: 22.4px;">Contato</span><br /></span></p>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

        <table id="u_content_text_34" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div class="v-text-align" style="font-size: 14px; color: #4c5763; line-height: 170%; text-align: center; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 170%;">support@domain.com <br />sales@domain.com</p>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-50p01" style="max-width: 320px;min-width: 300.04px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table id="u_content_text_29" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div class="v-text-align" style="font-size: 14px; color: #00d09c; line-height: 140%; text-align: center; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"><span style="font-family: Cabin, sans-serif; font-size: 16px; line-height: 22.4px;">Siga-nos<br /></span></p>
          </div>

              </td>
            </tr>
          </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <div align="center">
          <div style="display: table; max-width:93px;">
          <!--[if (mso)|(IE)]><table width="93" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:93px;"><tr><![endif]-->
          
            
            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                <a href="https://instagram.com/" title="Instagram" target="_blank">
                  <img src="${this.images.instagram}" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                </a>
              </td></tr>
            </tbody></table>
            <!--[if (mso)|(IE)]></td><![endif]-->
            
            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                <a href="https://linkedin.com/" title="LinkedIn" target="_blank">
                  <img src="${this.images.linkedIn}" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                </a>
              </td></tr>
            </tbody></table>
            <!--[if (mso)|(IE)]></td><![endif]-->
            
            
            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
          </div>
        </div>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #d9f7ed;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #d9f7ed;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #d9f7ed;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <span>&#160;</span>
                </td>
              </tr>
            </tbody>
          </table>

              </td>
            </tr>
          </tbody>
        </table>

          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
          </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
          </div>
          </div>
          


            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
          </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>

        </html>

      `,
    };
    try {
      const { data } = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        content,
        {
          headers: { 'api-key': process.env.SENDINBLUE_API_KEY },
        },
      );
      return data;
    } catch (error: any) {
      throw new BadRequestException('Não foi possível enviar o email');
    }
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    if (!process.env.SENDINBLUE_API_KEY || !process.env.TO_EMAIL) {
      throw new BadRequestException(
        `ERROR SENDING EMAIL VIA SENDGRID: Check your environment variable config`,
      );
    }
    const { name, phone, email, message } = sendEmailDto;
    const content = {
      to: [
        {
          email: process.env.TO_EMAIL,
          name: process.env.TO_EMAIL_NAME,
        },
      ],
      sender: {
        email,
        name,
      },
      subject: `Maré Mansa Empreendimentos`,
      htmlContent: `
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
          <!--[if gte mso 9]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
            <title></title>
            
              <style type="text/css">
                @media only screen and (min-width: 670px) {
            .u-row {
              width: 650px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }

            .u-row .u-col-100 {
              width: 650px !important;
            }

          }

          @media (max-width: 670px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: calc(100% - 40px) !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col > div {
              margin: 0 auto;
            }
          }
          body {
            margin: 0;
            padding: 0;
          }

          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }

          p {
            margin: 0;
          }

          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }

          * {
            line-height: inherit;
          }

          a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
          }

          table, td { color: #000000; } </style>
            
            

          <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

          </head>

          <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
              

          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #dff1ff;">
              <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #dff1ff;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
            <div style="width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 0px;font-family:'Montserrat',sans-serif;" align="left">
                  
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right: 0px;padding-left: 0px;" align="center">
                
                <img align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/maremansaempreendimentos-febf8.appspot.com/o/geral%2Flogo.png?alt=media&token=38c66f69-c0ee-41f9-90bd-ed2b74d125a6" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 24%;max-width: 156px;" width="156"/>
                
              </td>
            </tr>
          </table>

                </td>
              </tr>
            </tbody>
          </table>

          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Montserrat',sans-serif;" align="left">
                  
            <div style="color: #018eea; line-height: 170%; text-align: left; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 170%; text-align: center;"><span style="font-size: 24px; line-height: 40.8px;"><strong><span style="line-height: 40.8px; font-size: 24px;">${name}</span></strong></span></p>
          <p style="font-size: 14px; line-height: 170%; text-align: center;"><span style="font-size: 20px; line-height: 34px;"><span style="line-height: 34px; font-size: 20px;">${email}</span></span></p>
            </div>

                </td>
              </tr>
            </tbody>
          </table>

          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Montserrat',sans-serif;" align="left">
                  
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right: 0px;padding-left: 0px;" align="center">
                
                <img align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/maremansaempreendimentos-febf8.appspot.com/o/geral%2F26822.jpg?alt=media&token=9887665f-1791-4a40-b995-5f412fb3d1d6" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 650px;" width="650"/>
                
              </td>
            </tr>
          </table>

                </td>
              </tr>
            </tbody>
          </table>

            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>



          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f3fbfd;">
              <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #f3fbfd;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
            <div style="width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Montserrat',sans-serif;" align="left">
                  
            <div style="color: #1b262c; line-height: 140%; text-align: center; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><strong><span style="font-size: 26px; line-height: 36.4px;">${phone}</span></strong></p>
            </div>

                </td>
              </tr>
            </tbody>
          </table>

          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px 20px;font-family:'Montserrat',sans-serif;" align="left">
                  
            <div style="color: #1b262c; line-height: 140%; text-align: center; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px;">${message}</span></p>
            </div>

                </td>
              </tr>
            </tbody>
          </table>

            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>



          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #151418;">
              <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #151418;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
            <div style="width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:18px;font-family:'Montserrat',sans-serif;" align="left">
                  
            <div style="color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 14px; line-height: 19.6px;">Copyright WrsTech | All RIghts Reserved</span></p>
            </div>

                </td>
              </tr>
            </tbody>
          </table>

            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>


              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
            </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
          </body>
        </html>
      `,
    };
    try {
      const { data } = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        content,
        {
          headers: { 'api-key': process.env.SENDINBLUE_API_KEY },
        },
      );
      return data;
    } catch (error: any) {
      throw new BadRequestException('Não foi possível enviar o email');
    }
  }
}
