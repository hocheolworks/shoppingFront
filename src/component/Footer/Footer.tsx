import Link from "next/link";
import React, { FC } from "react";

// import "./Footer.css";

const Footer: FC = () => {
  return (
    <footer className="page-footer p-5 bg-black text-white">
      <div className="container">
        <div className="justify-content-between">
          <div className="footer-container">
            <div className="footer-item">
              <p>진솔유통 - 마트가방</p>
              <p>대표 : 김진솔 | 사업자번호 : 206-34-61779</p>
              <p>본사 : 서울시 용산구 신흥로 3길 22-1</p>
              <p>영종도 공장 : 인천시 중구 운북동 168-29</p>
              <p>전화 : 010-2269-9422 또는 010-4826-0519</p>
              <p>통신판매신고 : Copyright (C) 2022 jinsoltrade all rights reserved.</p>
            </div>
            <div className="footer-item">
              <p>상담 가능 시간 : 24시간 전화 상담 가능</p>
            </div>
            <div>
              <h6>진솔유통 기본약관</h6>
              <Link href={'/'}><a className="mr-5">개인정보 처리방침</a></Link>
              <Link href={'/'}><a className="mr-5">전자금융거래 기본약관</a></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
