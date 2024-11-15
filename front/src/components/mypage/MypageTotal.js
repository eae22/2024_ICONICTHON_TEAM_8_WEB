import Header from "../basic/Header";
import PersonalGetList from "./PersonalGetList";
import PersonalInfo from "./PersonalInfo";
import "./MypageTotal.css";

function MypageTotal() {
  return (
    <div className="MypageTotal_all_layout">
      <Header name="마이페이지" />
      <PersonalInfo />
      <div className="application-details-title">수취 신청 내역</div>
      <PersonalGetList />
    </div>
  );
}

export default MypageTotal;
