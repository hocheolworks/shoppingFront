import React, { FC } from 'react';
import Link from 'next/link';

const HomePageTheme: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-5">
            <Link href="/menu?id=female">
              <a>
                <img
                  className="img-fluid"
                  src="https://i.ibb.co/jMmJs60/Them-Woman-ENG.jpg"
                />
              </a>
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-5">
            <Link href="/menu?id=male">
              <a>
                <img
                  className="img-fluid"
                  src="https://i.ibb.co/mJGKz8c/Them-Man-ENG.jpg"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageTheme;
