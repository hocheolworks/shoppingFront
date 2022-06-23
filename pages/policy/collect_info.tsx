import { FC, FormEvent, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


const text = '비회원정보수집 동의\n \
비회원 개인정보보호정책은 비회원으로 주문하는 고객님의 개인정보 보호를 위하여 진솔유통이 실시하는 개인정보 수집의 목적과 그 정보의 정책에 관한 규정입니다.\n \
\n \
제1조 개인정보 수집 범위\n \
1.물품 구매 시\n \
필수항목: 구매자 정보(성명, 전화번호, 휴대전화 번호, 이메일) 수령자 정보(성명, 전화번호, 휴대전화번호, 주소)\n \
2.환불 요청 시\n \
필수항목: 환불계좌\n \
\n \
제2조 개인정보 수집 목적 및 이용목적\n \
진솔유통은 고객님께서 비회원으로 재화 혹은 용역을 주문하거나 각종 서비스를 이용하는데 있어, 원활한 주문 및 서비스 접수, 물품 배송, 대금 결제 및 편리하고 유익한 맞춤정보를 제공하기 위한 최소한의 정보를 수집합니다.\n \
\n \
1.e-mail, 전화번호 : 고지의 전달. 불만처리나 주문/배송정보 안내 등 원활한 의사소통 경로의 확보.\n \
2.성명, 주소 : 고지의 전달, 청구서, 정확한 상품 배송지의 확보.\n \
3.은행계좌번호, 신용카드번호: 유료정보에 대한 이용 및 상품구매에 대한 결제\n \
4.전화번호, 휴대전화번호 : 상품구매 전/후 만족도조사, 회원가입권유(포인트 또는 적립금 지급 등)및 영업 목적 전화 및 SMS발송\n \
\n \
비회원 주문 시 제공하신 모든 정보는 상기 목적에 필요한 용도 이외로는 사용되지 않습니다.\n \
단, 이용자의 기본적 인권 침해의 우려가 있는 민감한 개인정보(인종 및 민족, 사상 및 종교, 출신지 및 본적지, 정치적 성향 및 범죄기록, 건강상태 등)는 수집하지 않습니다.\n \
\n \
제3조 개인정보의 보유기간 및 이용기간\n \
고객의 개인정보는 다음과 같이 개인정보의 수집목적 또는 제공받은 목적이 달성되면 파기됩니다. 단, 상법 등 관련법령의 규정에 의하여 다음과 같이 거래 관련 권리 의무 관계의 확인 등을 이유로 일정기간 보유하여야 할 필요가 있을 경우에는 일정기간 보유합니다.\n \
1.계약 또는 청약철회 등에 관한 기록 : 5년\n \
2.대금결제 및 재화등의 공급에 관한 기록 : 5년\n \
3.소비자의 불만 또는 분쟁처리에 관한 기록 : 3년\n \
\n \
제4조\n \
동의 거부시 불이익 귀하는 개인정보 수집 및 이용 등에 관해 동의하지 않을 권리가 있습니다. 다만, 필수수집 동의를 하지 않을 경우 구매가 제한될 수 있습니다.\n \
\n \
고객의 동의를 받아 보유하고 있는 거래정보 등을 고객께서 열람을 요구하는 경우 진솔유통은 지체 없이 그 정보를 열람·확인 할 수 있도록 조치합니다.'

const CollectInfo: FC = () => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [check1,setCheck1] = useState(false);

  const handleCheck1 = ():void => {
    if(check1) {
      setCheck1(false);
    }
    else {
      setCheck1(true);
    }
  }

  const fregister_submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    let error_html = "<i>error의 내용에 동의하셔야 회원가입 하실 수 있습니다.</i>";
    let error_text = '';

    if(!check1) {
      error_text += '필수 약관'
    }

    if(check1) {
      router.push('/order');
    }
    else {
      error_html = error_html.replace('error', error_text);
      MySwal.fire({
        html: error_html,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: '확인',
      });
    }
  }

  return (
    <div id='mid'>
      <div id="wrapper" className="container">
        <div id="container_wr">
          <h2 className="regi_tt">비회원 개인정보수집 동의</h2>

          <div id="register_agree">
            <h3>약관 동의</h3>
            <form name="fregister" id="fregister" autoComplete="off" onSubmit={fregister_submit}>
              <section id="fregister_term">
                <div className='fregister_agree2 checks2'>
                  <input type='checkbox' name='agree' value='1' id='agree11' checked={check1} onChange={handleCheck1}/>
                  <label htmlFor='agree11'>이용약관 동의<span>(필수)</span></label>
                </div>
                <textarea readOnly id="area1">
                {text}
                </textarea>
              </section>

              <div className="btn_confirm">
                <Link href={'/cart'}><a className='btn_cancel'>취소</a></Link>
                <input type="submit" className="btn_submit" value="확인" id="btn_submit"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectInfo;