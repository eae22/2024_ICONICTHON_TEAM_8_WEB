import './Header.css';

function Header({ name }) {
  return (
    <div className="Header_all">
      <div className="Header_body">
        <div className="Header_name">{name}</div>
      </div>
    </div>
  );
}

export default Header;
