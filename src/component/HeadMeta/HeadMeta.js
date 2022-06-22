import Head from "next/head";

const HeadMeta = ({ title, description, url, image }) => {
  return (
    <Head>
      <title>{title || "진솔유통 - 마트 가방 전문"}</title>
      <meta
        name="description"
        content={
          description ||
          "타포린 마트 가방을 전문으로 하는 진솔유통입니다. 소량 제작및 소량 인쇄, 주문 제작 무료 견적, 대량 주문 시 전국 최저가 보장합니다!"
        }
      />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        property="og:title"
        content={title || "진솔유통 - 마트 가방 전문"}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://jinsoltrade.com"} />
      <meta property="og:image" content={image} />
      <meta property="og:article:author" content="진솔유통" />
    </Head>
  );
};

export default HeadMeta;
