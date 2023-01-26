import React from "react";
import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";

import whatsappIcon from "@/assets/whatsapp_icon.png";
import telegramIcon from "@/assets/telegram_icon.png";
import fbIcon from "@/assets/fb_icon.png";

import "./MessageShare.scss";

export default function MessageShare({ message, referCode }) {
  const url = `https://mamashakuni.com/register?refer_code=${referCode}`;
  return (
    <div className="MessageShare">
      <WhatsappShareButton url={url} title={message}>
        <img className="MessageShare__Icon" src={whatsappIcon} />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={message}>
        <img className="MessageShare__Icon" src={telegramIcon} />
      </TelegramShareButton>
      <FacebookShareButton url={url} quote={message}>
        <img className="MessageShare__Icon" src={fbIcon} />
      </FacebookShareButton>
    </div>
  );
}
