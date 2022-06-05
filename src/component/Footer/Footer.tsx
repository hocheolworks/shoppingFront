import React, { FC } from "react";

// import "./Footer.css";

const Footer: FC = () => {
  return (
    <footer className="page-footer p-5 bg-black text-white">
      <div className="container">
        <div className="justify-content-between">
          <div className="footer-container">
            <div className="footer-item">
              <h3>진솔유통</h3>
              <p>010-4826-0519</p>
            </div>
            <div className="footer-item">
              <p>상담 가능 시간 : (평일) 09:00 - 20:00</p>
            </div>
            <div className="footer-item">
              <p>© Copy right 진솔유통</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
